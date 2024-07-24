
const User = require("../models/user.model");
const Duel = require("../models/duel.model.js")
const Pets = require("../models/pet.model.js")
const PetsLibary = require("../models/petLibary.model.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP =require("../models/otp.model")
const crypto =require("crypto")
const mailer = require("../utils/sendMailConfig");

const logger = require('../logger');


const baseStatusEffectChance = 0.05; // 5% base chance
const elements = ['Light', 'Shadow', 'Fire', 'Water', 'Earth', 'Metal', 'Air', 'Lightning', 'Ice', 'Nature'];

const statusEffectsConfig = {
  Light: { type: 'dazzle', baseDuration: 2, baseValue: 5 },
  Shadow: { type: 'fear', baseDuration: 3, baseValue: 4 },
  Fire: { type: 'burn', baseDuration: 3, baseValue: 6 },
  Water: { type: 'soak', baseDuration: 2, baseValue: 4 },
  Earth: { type: 'petrify', baseDuration: 2, baseValue: 5 }, 
  Metal: { type: 'corrode', baseDuration: 3, baseValue: 5 },
  Air: { type: 'disorient', baseDuration: 2, baseValue: 4 },
  Lightning: { type: 'shock', baseDuration: 1, baseValue: 6 },
  Ice: { type: 'freeze', baseDuration: 3, baseValue: 4 },
  Nature: { type: 'rooted', baseDuration: 3, baseValue: 5 }
};

const statusEffects = {
  Light: "dazzle",
  Shadow: "fear",
  Fire: "burn",
  Water: "soak",
  Earth: "petrify",
  Metal: "corrode",
  Air: "disorient",
  Lightning: "shock",
  Ice: "freeze",
  Nature: "rooted"
};

const elementWeaknesses = {
  'Light': ['Shadow'],
  'Shadow': ['Light'],
  'Fire': ['Water', 'Earth'],
  'Water': ['Lightning', 'Nature'],
  'Earth': ['Fire', 'Ice'],
  'Metal': ['Fire', 'Lightning'],
  'Air': ['Metal', 'Lightning'],
  'Lightning': ['Earth', 'Metal'],
  'Ice': ['Fire', 'Nature'],
  'Nature': ['Fire', 'Ice']
};

const elementStrengths = {
  'Light': ['Shadow'],
  'Shadow': ['Light'],
  'Fire': ['Nature', 'Ice'],
  'Water': ['Fire', 'Shadow'],
  'Earth': ['Lightning', 'Metal'],
  'Metal': ['Air', 'Ice'],
  'Air': ['Earth', 'Nature'],
  'Lightning': ['Water', 'Air'],
  'Ice': ['Earth', 'Water'],
  'Nature': ['Water', 'Earth']
};

// Helper functions
const applyElementalStatusEffect = (attacker, defender, duel, socket, io) => {
  // Ensure defender.statusEffects is an array
  if (!Array.isArray(defender.statusEffects)) {
    defender.statusEffects = [];
  }

  console.log('Defender status effects before:', defender.statusEffects);

  const activeEffects = defender.statusEffects.length;
  let statusEffectChance = baseStatusEffectChance;

  if (activeEffects > 0) {
    statusEffectChance = 0.5; // Reduced chance if under a status effect
  }

  for (const element of attacker.activePet.petInfo.element) {
    console.log(`Checking element: ${element}`);
    
    if (statusEffects[element]) {
      const chance = Math.random();
      console.log(`Chance for ${element}: ${chance}, required: ${statusEffectChance}`);
      
      if (chance <= statusEffectChance) {
        const existingEffect = defender.statusEffects.find(effect => effect.type === statusEffects[element]);
        console.log(`Existing effect for ${element}:`, existingEffect);

          // Apply new effect
          const newEffect = {
            type: statusEffects[element],
            duration: statusEffectsConfig[element].baseDuration,
            value: statusEffectsConfig[element].baseValue
          };
          defender.statusEffects.push(newEffect);
          console.log(`Applied new effect:`, newEffect);
        

        if (defender.statusEffects.length >= 2) break; // Maximum of 2 active status effects
        
        io.of("game").in(duel._id.toString()).emit('statusEffectApplied', {
          defenderId: defender.userId?.toString(),
          attackerId: attacker.userId?.toString(),
          defenderMessage: `Your ${defender.activePet.petInfo.name} has been hit with the status effect ${statusEffects[element]} which lasts for ${statusEffectsConfig[element].baseDuration} rounds.`,
          attackerMessage: `Your ${attacker.activePet.petInfo.name} has given the status effect ${statusEffects[element]} to your opponent which lasts for ${statusEffectsConfig[element].baseDuration} rounds.`,
          updatedGameState: duel
        });
      }
    }
  }
  
  console.log('Defender status effects after:', defender.statusEffects);
};


const checkEffectsCheck = async (player, duel, socket,io) => {
  let shouldSave = false;

  // Iterate over the statusEffects array
  for (let i = 0; i < player.statusEffects.length; i++) {
    let effect = player.statusEffects[i];
    if (effect.duration > 0) {
      switch (effect.type) {
        case 'burn':
        case 'soak':
          player.health -= effect.value;
          player.activePet.currentHealth -= effect.value;
           io.of("game").in(duel._id.toString()).emit('statusEffectChange', {
            forUser: player.userId?.toString(),
            damageTaken:effect.value,
            message: `Your health and that of your ${player.activePet.petInfo.name} have dropped by ${effect.value}.`,
            statusEffects: effect.type,
            updatedGameState: duel
          });
          shouldSave = true;
          break;
        case 'freeze':
        case 'petrify':
        case 'rooted':
          // Handle stunned logic
          duel.currentTurn = duel.currentTurn === "player1" ? "player2" : "player1";
           io.of("game").in(duel._id.toString()).emit('statusEffectChange', {
            forUser: player.userId?.toString(),
            message: `Your turn has been skipped due to the ${effect.type} status effect.`,
            damageTaken:effect.value,
            statusEffects: effect.type,
            updatedGameState: duel
          });
          shouldSave = true;
          break;
        case 'disorient':
        case 'fear':
        case 'dazzle':
          // Increase miss probability
          player.missVariable = (player.missVariable || 0) + 0.15;
           io.of("game").in(duel._id.toString()).emit('statusEffectChange', {
            forUser: player.userId?.toString(),
            message: `Due to ${effect.type}, your probability of missing has increased.`,
            statusEffects: effect.type,
            updatedGameState: duel
          });
          shouldSave = true;
          break;
        case 'corrode':
          player.activePet.currentDefense -= effect.value; // Reduce defense
           io.of("game").in(duel._id.toString()).emit('statusEffectChange', {
            forUser: player.userId?.toString(),
            message: `Due to corrosion, your ${player.activePet.petInfo.name}'s defense has permanently dropped by ${effect.value}.`,
            statusEffects: effect.type,
            updatedGameState: duel
          });
          shouldSave = true;
          break;
        case 'shock':
          player.health -= effect.value;
          player.activePet.currentHealth -= effect.value;
          player.currentDeck.forEach(pet => pet.currentHealth -= effect.value);
           io.of("game").in(duel._id.toString()).emit('statusEffectChange', {
            forUser: player.userId?.toString(),
            message: `Due to chain shock, all health units on your side have dropped by ${effect.value}.`,
            statusEffects: effect.type,
            updatedGameState: duel
          });
          shouldSave = true;
          break;
      }
      effect.duration -= 1;
    }

    // Remove the effect if its duration is 0
    if (effect.duration <= 0) {
      player.statusEffects.splice(i, 1);
      i--; // Adjust index due to array modification
       io.of("game").in(duel._id.toString()).emit('statusEffectChange', {
        forUser: player.userId?.toString(),
        message: `The ${effect.type} status effect has been lifted.`,
        statusEffects: null,
        updatedGameState: duel
      });
      shouldSave = true;
    }
  }

  if (player.activePet.currentHealth <= 0) {
    player.discardPile.push(player.activePet);
    player.activePet = player.currentDeck.shift();
     io.of("game").in(duel._id.toString()).emit('statusEffectChange', {
      forUser: player.userId?.toString(),
      message: `Oops, your pet died and has been discarded.`,
      statusEffects: null,
      updatedGameState: duel
    });
    shouldSave = true;
  }

  if (shouldSave) {
    await duel.save();
  }
};


const calculateElementMultiplier = (attackerElements, defenderElements) => {
  let strengthMultiplier = 1;
  let weaknessMultiplier = 1;

  attackerElements.forEach(attackerElement => {
    defenderElements.forEach(defenderElement => {
      if (elementWeaknesses[attackerElement] && elementWeaknesses[attackerElement].includes(defenderElement)) {
        weaknessMultiplier *= 0.75; // 25% reduction in attack
      }
      if (elementStrengths[attackerElement] && elementStrengths[attackerElement].includes(defenderElement)) {
        strengthMultiplier *= 1.25; // 25% increase in attack
      }
    });
  });

  return {strengthMultiplier,weaknessMultiplier}; ;
};

const getRarityDefense = (rarity) => {
  switch (rarity) {
    case "Rustic":
      return 25;
    case "Arcane":
      return 20;
    case "Mythic":
      return 15;
    case "Exalted":
      return 10;
    case "Ethereal":
      return 5;
    default:
      return 50;
  }
};

const opponentClassCheck = (petClass, effectiveDefense, missVariable) => {
  const classChance = Math.random();
  switch (petClass) {
    case "Guardian":
      if (classChance <= 0.2) {
        return effectiveDefense * 1.2;
      }
      break;
    case "Nimble":
      if (classChance <= 0.2) {
        missVariable *= 2;
      }
      break;
    default:
      return effectiveDefense;
  }
  return effectiveDefense;
};

const attackerClassCheck = (petClass, attackMultiplier) => {
  const classChance = Math.random();
  switch (petClass) {
    case "Breaker":
      if (classChance <= 0.2) {
        opponentEffectiveDefense * 0; // Breaker reduces effective defense to 1
        return attackMultiplier
      }
      break;
    case "Predator":
       if (classChance <= 0.2) {
        return attackMultiplier * 1.2;
      }
      
    default:
      return attackMultiplier;
  }
  return attackMultiplier;
};

const missCheck = (missVariable) => {
  const chance = Math.random();
  return chance <= missVariable;
};

const endGame = async (duel, winnerId, loserId,socket,io) => {
    const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();
  duel.isActive = false;
  duel.status = "completed";
  duel.winner = winnerId;
  duel.loser = loserId;
  
  duel.result = winnerId === player1Id ? 'player1' : 'player2';
  await duel.save();
   io.of("game").in(duel._id.toString()).emit('gameEnd', {
    message: "The game has ended",
    winner: winnerId,
    loser: loserId,
    updatedGameState:duel
  });
     // Disconnect all players from the room
  const clients = socket.adapter.rooms.get(duel._Id) || [];
  clients.forEach(socketId => {
     socket.sockets.get(socketId).disconnect(true);
  });

  // Cleanup: Remove the room
   socket.adapter.rooms.delete(duel._Id);
 

  // Clean up any room-specific resources or data if needed
  console.log(`Room ${duel._Id} has been closed and all players have been disconnected.`);

};

const winConditionCheck = (duel) => {
  const player1 = duel.players.player1;
  const player2 = duel.players.player2;

  // Check if any player's health is zero or below
  if (player1.health <= 0) return 'player2';
  if (player2.health <= 0) return 'player1';

  // Check if turn limit is reached
  if (duel.noOfTurns >= duel.turnLimit) {
    let player1DeckHealthSum = 0;
    let player2DeckHealthSum = 0;

    // Calculate sum of current health of cards in each player's deck
    for (let card of player1.currentDeck) {
      player1DeckHealthSum += card.currentHealth;
    }
    for (let card of player2.currentDeck) {
      player2DeckHealthSum += card.currentHealth;
    }

    // Calculate total health including player's base health and deck card health
    const player1TotalHealth = player1.health + player1DeckHealthSum;
    const player2TotalHealth = player2.health + player2DeckHealthSum;

    // Determine winner based on total health
    if (player1TotalHealth === player2TotalHealth) return 'draw';
    return player1TotalHealth > player2TotalHealth ? 'player1' : 'player2';
  }

  // Return null if no win condition is met
  return null;
};


const rewardPlayer = async (winnerId, currency, experience,duel,socket,io) => {
  const user = await User.findById(winnerId);
  if (!user) return  io.of("game").in(duel._id.toString()).emit('notificationError', {
    message: "user with the Credentials does not exist",
    forUser: winnerId,
    
  });
  const randomMultiplier = 1 + Math.random();
  user.profile.Argentum += currency;
  user.profile.experience += experience * randomMultiplier;
  user.userStats.Duelpoints += experience * randomMultiplier * 0.2;
  user.userStats.duelsWon++;
  user.userStats.duelsWoninCurrentSeason++;

  await user.save();
};


const loserPenalty = async (loserId, experience,duel,socket,io) => {
  const user = await User.findById(loserId);
  if (!user) return  io.of("game").in(duel._id.toString()).emit('notificationError', {
    message: "user with the Credentials does not exist",
    forUser: loserId,
  });
  const randomMultiplier = Math.random();
  user.profile.experience -= experience * randomMultiplier;
  user.userStats.Duelpoints -= experience * randomMultiplier * 0.2;
  user.userStats.duelsLost++;
  user.userStats.duelsLostinCurrentSeason++;

  await user.save();
};


const handleGameDraw = async (player1Id, player2Id, currency, experience, duel,socket,io) => {
  const player1 = await User.findById(player1Id);
  const player2 = await User.findById(player2Id);
  if (!player1 ) return  io.of("game").in(duel._id.toString()).emit('notificationError', {
    message: "user with the Credentials does not exist",
    forUser: player1Id,
  });
  if ( !player2) return  io.of("game").in(duel._id.toString()).emit('notificationError', {
    message: "user with the Credentials does not exist",
    forUser: player2Id,
  });
  const randomMultiplier = 1 + Math.random();
  player1.profile.Argentum += currency * 0.5;
  player1.profile.experience += experience * randomMultiplier * 0.5;
  player1.userStats.Duelpoints += experience * randomMultiplier * 0.7;
  player2.profile.Argentum += currency * 0.5;
  player2.profile.experience += experience * randomMultiplier * 0.5;
  player2.userStats.Duelpoints += experience * randomMultiplier * 0.7;

  duel.isActive = false;
  duel.status = "completed";
  duel.winner = "";
  duel.loser = "";
  duel.result = "draw";

  await duel.save();
  await player1.save();
  await player2.save();

   io.of("game").in(duel._id.toString()).emit('gameEnd', {
    winner:"draw",
    loser:"draw",
    message: "The game has ended in a draw",
  });

    // Disconnect all players from the room
  const clients =  socket.adapter.rooms.get(duel._Id) || [];
  clients.forEach(socketId => {
     socket.sockets.get(socketId).disconnect(true);
  });

  // Cleanup: Remove the room
   socket.adapter.rooms.delete(duel._Id);

  // Clean up any room-specific resources or data if needed
  console.log(`Room ${duel._Id} has been closed and all players have been disconnected.`);

};

const handleEndOfGame = async (duel,socket,io) => {
  const winner = winConditionCheck(duel);
  const rewards = duel.rewards;

   const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();
  if (winner) {
    if (winner === "draw") {
      await handleGameDraw(player1Id, player2Id, rewards.currency, rewards.experience, duel,socket,io);
    } else {
      const winnerId = winner === 'player1' ? player1Id : player2Id;
      const loserId = winner === 'player1' ? player2Id : player1Id;
      await rewardPlayer(winnerId, rewards.currency, rewards.experience,duel,socket,io);
      await loserPenalty(loserId, rewards.experience,duel,socket,io);
      await endGame(duel, winnerId, loserId,socket,io);
    }
  }
};




// Handles the attack action in a duel
const userAction_Attack = async (io,socket,data) => {
  try {
    // Destructure the userId and sessionID from the data object
    const { userId, sessionID } = data;
    const playerId = userId; // Player's ID initiating the action
    const duelId = sessionID; // Duel's ID where the action is taking place

    console.log("Starting attack action for user:", userId, "in session:", sessionID);

    // Fetch user details from the database
    const user = await User.findById(playerId);
    if (!user) {
      console.log("User not found:", playerId);
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    // Fetch duel details from the database
    const duel = await Duel.findById(duelId);
    if (!duel) {
      console.log("Duel not found:", duelId);
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }

    // Check if the duel is still active
    if (!duel.isActive) {
      console.log("Duel is no longer active:", duelId);
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "The duel is no longer active.",
      });
    }

    // Check if the player is part of the duel
    const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();
    const isPlayerInDuel = [player1Id, player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      console.log("User is not a player in the duel:", playerId);
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in this duel.",
      });
    }

    // Determine the current and opponent players
    const currentPlayer = duel.currentTurn === "player1" ? duel.players.player1 : duel.players.player2;
    const opponentPlayer = duel.currentTurn === "player1" ? duel.players.player2 : duel.players.player1;

    // Check if the opponent and the current player are connected
    if (opponentPlayer.playerStatus !== "connected") {
      console.log("Opponent is not connected:", opponentPlayer.userId);
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: currentPlayer.userId?.toString(),
        message: "The opponent is not currently in the game. Await their return to continue.",
      });
    }
    if (currentPlayer.playerStatus !== "connected") {
      console.log("Current player is not connected:", currentPlayer.userId);
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: currentPlayer.userId?.toString(),
        message: "You are not connected to the game. Reconnect to perform an action.",
      });
    }

    // Ensure it's the current player's turn
    if (playerId !== currentPlayer.userId?.toString()) {
      console.log("It's not the player's turn:", playerId);
      return  io.of("game").in(duelId).emit('notificationWarning', {
        forUser: opponentPlayer.userId?.toString(),
        message: "It's not your turn.",
        updatedGameState: duel,
      });
    }

    let attackMultiplier = 1;
    let missVariable = 0.1; // Variable used to determine the chance of missing the attack

    // Check if the current player has enough mana to attack
    if (currentPlayer.manaPool < currentPlayer.activePet.currentManaCost) {
      duel.currentTurn = duel.currentTurn === "player1" ? "player2" : "player1"; // Skip the turn if mana is insufficient
      currentPlayer.manaPool += currentPlayer.activePet.currentManaCost * 0.7; // Restore some mana
      await duel.save();
      console.log("Not enough mana to attack. Turn skipped. Mana added.");
      return  io.of("game").in(duelId).emit('notificationWarning', {
        forUser: currentPlayer.userId?.toString(), 
        message: `You do not have enough mana to attack. Your turn has been skipped. ${currentPlayer.activePet.currentManaCost * 0.7} mana has been added to your mana.`,
        updatedGameState: duel,
      });
    }

    // Calculate the opponent's effective defense
    let opponentEffectiveDefense = opponentPlayer.activePet.currentDefense / getRarityDefense(opponentPlayer.activePet.rarity);
    console.log("Calculated opponent's effective defense:", opponentEffectiveDefense);

    // Adjust effective defense based on class and check if attack misses
    opponentEffectiveDefense = opponentClassCheck(opponentPlayer.activePet.petInfo.class, opponentEffectiveDefense, missVariable);
    attackMultiplier = attackerClassCheck(currentPlayer.activePet.petInfo.class, attackMultiplier);

    // Calculate elemental multipliers
    const { strengthMultiplier, weaknessMultiplier } = calculateElementMultiplier(currentPlayer.activePet.petInfo.element, opponentPlayer.activePet.petInfo.element);
    attackMultiplier *= strengthMultiplier;
    opponentEffectiveDefense *= weaknessMultiplier;
    console.log("Applied elemental multipliers. Attack multiplier:", attackMultiplier, "Effective defense:", opponentEffectiveDefense);

    // Check if the attack misses
    if (missCheck(missVariable)) {
      attackMultiplier = 0;
      console.log("Attack missed.");
    }

    // Determine the amount of mana to be regained
    let getManaBack ;
    

    // Apply elemental status effects and check effects
    applyElementalStatusEffect(currentPlayer, opponentPlayer, duel, socket,io);
    await checkEffectsCheck(currentPlayer, duel, socket,io);
    await checkEffectsCheck(opponentPlayer, duel, socket,io);
    console.log("Checked and applied status effects.");

    // Calculate damage dealt
    let damage = currentPlayer.activePet.currentAttack * attackMultiplier / (opponentEffectiveDefense/2);
    console.log(currentPlayer.activePet.currentAttack,attackMultiplier,opponentEffectiveDefense)
    if (opponentPlayer.isDefending) {
      damage /= 5; // Reduce damage if the opponent is defending
      console.log("Opponent is defending. Damage reduced to:", damage);
    }

    let opponentDamage = 0

    // Update health and mana based on damage
    if (damage > opponentPlayer.activePet.currentHealth) {
      const remainingDamage = damage - opponentPlayer.activePet.currentHealth;
      opponentPlayer.health -= remainingDamage;
      opponentPlayer.health = Math.round(opponentPlayer.health); // Round and assign
      opponentPlayer.activePet.currentHealth = 0;
      opponentPlayer.discardPile.push(opponentPlayer.activePet);

      // Assign a new active pet from the current deck
      opponentPlayer.activePet = opponentPlayer.currentDeck[0];
      opponentPlayer.currentDeck = opponentPlayer.currentDeck.slice(1);

      getManaBack = currentPlayer.activePet.currentManaCost * 0.6;
      console.log("Opponent's pet defeated. Remaining damage:", remainingDamage, "New active pet assigned.");
    } else {
      opponentPlayer.activePet.currentHealth -= damage;
      opponentPlayer.activePet.currentHealth = Math.round(opponentPlayer.activePet.currentHealth); // Round and assign

      currentPlayer.activePet.currentHealth -= damage / 3.5;
      opponentDamage = damage / 3.5
      currentPlayer.activePet.currentHealth = Math.round(currentPlayer.activePet.currentHealth); // Round and assign

      if (currentPlayer.activePet.currentHealth <= 0) {
        currentPlayer.discardPile.push(currentPlayer.activePet);

        // Assign a new active pet from the current deck
        currentPlayer.activePet = currentPlayer.currentDeck[0];
        currentPlayer.currentDeck = currentPlayer.currentDeck.slice(1);

        console.log("Current player's pet defeated. New active pet assigned.");
      }

      console.log("Opponent's pet took damage. Current health:", opponentPlayer.activePet.currentHealth);
      getManaBack = currentPlayer.activePet.currentManaCost * 0.4;
    }

    // Update mana pools
    currentPlayer.manaPool -= currentPlayer.activePet.currentManaCost;
    console.log("Mana to be regained:", getManaBack);
    currentPlayer.manaPool += getManaBack;
    currentPlayer.manaPool = Math.round(currentPlayer.manaPool); // Round and assign

    // Reset opponent's defending state and update turn
    opponentPlayer.isDefending = false;
    currentPlayer.isDefending =false;
    duel.noOfTurns++;
    duel.currentTurn = duel.currentTurn === "player1" ? "player2" : "player1";

    // Save the updated duel state to the database
    await handleEndOfGame(duel, socket,io);
    await duel.save();
    console.log("Attack action completed. Duel state saved.");

    // Emit the attack result to all clients in the duel room
    io.of("game").to(duelId).emit('attackResult', {
      forUser: currentPlayer.userId?.toString(),
      currentDamage:Math.round(damage),
      opponentDamage:Math.round(opponentDamage),
      message: `${currentPlayer.username} dealt ${damage} damage. to you`,
      updatedGameState: duel,
      turnMessage:`its ${opponentPlayer.username}'s turn`
    });
  } catch (error) {
    console.log("Error during attack action:", error);
     io.of("game").emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while performing the attack.",
    });
  }
};


const userAction_Defend = async (io,socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;
  

    const user = await User.findById(playerId);
    if (!user) {
      return  io.of("game").in(sessionID).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    const duel = await Duel.findById(sessionID);
    if (!duel) {
      return  io.of("game").in(sessionID).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }

    if (!duel.isActive) {
      return  io.of("game").in(sessionID).emit('notificationError', {
        forUser: playerId,
        message: "The duel is no longer active.",
      });
    }
     const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    const isPlayerInDuel = [player1Id,player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    const currentPlayer = duel.currentTurn === "player1" ? duel.players.player1 : duel.players.player2;
    const opponentPlayer = duel.currentTurn === "player1" ? duel.players.player2 : duel.players.player1;

    if (opponentPlayer.playerStatus !== "connected") {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: currentPlayer.userId?.toString(),
        message: "The opponent is not currently in the game. Await their return to continue.",
      });
    }

    if (currentPlayer.playerStatus !== "connected") {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: currentPlayer.userId?.toString(),
        message: "You are not connected to the game. Reconnect to perform an action.",
      });
    }

    if (playerId !== currentPlayer.userId?.toString()) {
      return  io.of("game").in(duelId).emit('notificationWarning', {
        forUser: opponentPlayer.userId?.toString(),
        message: "It's not your turn.",
        updatedGameState: duel,
      });
    }

    await checkEffectsCheck(currentPlayer, duel,socket,io);
    await checkEffectsCheck(opponentPlayer, duel,socket,io);

    if (currentPlayer.isDefending) {
      return  io.of("game").in(duelId).emit('notificationWarning', {
        forUser: currentPlayer.userId?.toString(),
        message: "Cannot defend while defense is already active.",
        updatedGameState: duel,
      });
    }

    currentPlayer.isDefending = true;
    currentPlayer.manaPool -= currentPlayer.activePet.currentManaCost * 0.8;
    const getManaBack = currentPlayer.activePet.currentManaCost * 0.5; // Adjust this value as needed
    currentPlayer.manaPool += getManaBack;
    currentPlayer.manaPool = Math.round(currentPlayer.manaPool)

    duel.noOfTurns++;
    duel.currentTurn = duel.currentTurn === "player1" ? "player2" : "player1";

    await handleEndOfGame(duel,socket,io);
    await duel.save();

     io.of("game").in(duelId).emit('defendResult', {
      forUser: currentPlayer.userId?.toString(),
      message: `Player ${currentPlayer.username} performed a defend action.`,
      updatedGameState: duel,
      turnMessage:`its ${opponentPlayer.username}'s turn`
    });
  } catch (error) {
    console.log("Error during defend action:", error);
     io.of("game").emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while performing the defend action.",
    });
  }
};

const userAction_LeaveActiveDuel = async (io,socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;

    // Fetch user by ID
    const user = await User.findById(playerId);
    if (!user) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a user.",
      });
    }

    // Fetch duel by ID
    const duel = await Duel.findById(duelId);
    if (!duel) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }

    // Check if duel is active
    if (!duel.isActive) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "The duel is no longer active.",
      });
    } const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    // Check if the user is a player in the duel
    const isPlayerInDuel = [player1Id, player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    // Determine current and opponent players
    const currentPlayer = player1Id === playerId ? duel.players.player1.toString() : duel.players.player2;
    const opponentPlayer = player1Id=== playerId ? duel.players.player2.toString() : duel.players.player1;

    // Handle rewards and penalties
    const rewards = duel.rewards;
    const winnerId = opponentPlayer.userId?.toString();
    const loserId = currentPlayer.userId?.toString();

    await rewardPlayer(winnerId, rewards.currency, rewards.experience,duel,socket,io);
    await loserPenalty(loserId, rewards.experience,duel,socket,io);
    await endGame(duel, winnerId, loserId,socket,io);

  } catch (error) {
    logger.error("Error leaving duel:", error);
     io.of("game").emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while leaving the duel.",
    });
  }
};


const GameLogic_HandlePlayerDisconnect = async (io,socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;

    // Fetch user by ID
    const user = await User.findById(playerId);
    if (!user) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a user.",
      });
    }

    // Fetch duel by ID
    const duel = await Duel.findById(duelId);
    if (!duel) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }
    const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    // Check if the user is a player in the duel
    const isPlayerInDuel = [player1Id, player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    // Check if duel is completed
    if (duel.status === "completed") {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "The duel has ended.",
      });
    }
    

    // Determine current and opponent players
    const currentPlayer = player1Id === playerId ? duel.players.player1: duel.players.player2;
    const opponentPlayer = player1Id === playerId ? duel.players.player2 : duel.players.player1;

    currentPlayer.playerStatus = "disconnected";

    // Set a timeout to end the game after 10 minutes if the player doesn't reconnect
    currentPlayer.timeout = setTimeout(async () => {
      const roomId = duel._id.toString();
      if (roomId) {
        const opponentId = opponentPlayer.userId?.toString();
        if (opponentId) {
           io.of("game").in(roomId).emit('opponentDisconnected', {
            message: `${currentPlayer.username} disconnected`,
            updatedGameState: duel
          });

          // Logic to declare opponent as the winner
          const rewards = duel.rewards;
          const winnerId = opponentPlayer.userId?.toString();
          const loserId = currentPlayer.userId?.toString();

          await rewardPlayer(winnerId, rewards.currency, rewards.experience,duel,socket,io);
          await loserPenalty(loserId, rewards.experience,duel,socket,io);
          await endGame(duel, winnerId, loserId,socket,io);

          // Update duel status to completed
          duel.status = "completed";
          duel.isActive = false;
          await duel.save();

          // Notify both players about the game end
           io.of("game").in(duelId).emit('gameEnded', {
            winnerId: winnerId,
            loserId: loserId,
            message: "The game has ended due to player disconnection."
          });
        }
      }
    }, 10 * 60 * 1000); // 10 minutes

  } catch (error) {
    logger.error("Error handling player disconnect:", error);
     io.of("game").emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while handling the player disconnect.",
    });
  }
};

const GameLogic_HandlePlayerReconnect = async (io,socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;



    const duel = await Duel.findById(duelId);
    if (!duel) {
      console.log(`No duel found for id ${duelId}`);
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }

    const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    // Check if the user is a player in the duel
    const isPlayerInDuel = [player1Id, player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return  io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }
    if(duel.status === "completed"){
      io.of("game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "The duel has ended.",
      });
    
    
   const rewards = duel.rewards;
          const winnerId = opponentPlayer.userId?.toString();
          const loserId = currentPlayer.userId?.toString();

          await rewardPlayer(winnerId, rewards.currency, rewards.experience,duel,socket,io);
          await loserPenalty(loserId, rewards.experience,duel,socket,io);
          await endGame(duel, winnerId, loserId,socket,io);

          // Update duel status to completed
          duel.status = "completed";
          duel.isActive = false;
          await duel.save();

          // Notify both players about the game end
           io.of("game").in(duelId).emit('gameEnded', {
            winnerId: winnerId,
            loserId: loserId,
            message: "The game has ended due to player disconnection."
          });
    }
 

    const currentPlayer = player1Id === playerId ? duel.players.player1 : duel.players.player2;
  

    if (currentPlayer.timeout) {
      clearTimeout(currentPlayer.timeout);
      currentPlayer.timeout = null;
  
    }

    currentPlayer.playerStatus = "connected";


     socket.join(duelId);
    console.log(`user joined game room ${duelId}`)

    await duel.save();

console.log(duelId);
     io.of("game").in(duelId).emit('notification',`player ${currentPlayer.username} has reconnected to the game.`,
    );

  } catch (error) {
    console.error("Error handling player reconnect:", error);
     io.of("game").emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while handling the player reconnect.",
    });
  }
};


module.exports = {
    
    userAction_Defend,
    userAction_Attack,
    userAction_LeaveActiveDuel,
    GameLogic_HandlePlayerDisconnect,
    GameLogic_HandlePlayerReconnect,

};

 
