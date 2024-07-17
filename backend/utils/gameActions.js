
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
const applyElementalStatusEffect = (attacker, defender,duel) => {
  const activeEffects = defender.statusEffects.length;
  let statusEffectChance = baseStatusEffectChance;

  if (activeEffects > 0) {
    statusEffectChance = 0.025; // Reduced chance if under a status effect
  }

  for (const element of attacker.elements) {
    if (statusEffects[element]) {
      const chance = Math.random();
      if (chance <= statusEffectChance) {
        const existingEffect = defender.statusEffects.find(effect => effect.type === statusEffects[element]);

        if (existingEffect) {
          // Stack the effect
          existingEffect.duration += statusEffectsConfig[element].baseDuration;
          existingEffect.value += statusEffectsConfig[element].baseValue;
        } else {
          // Apply new effect
          defender.statusEffects.push({
            type: statusEffects[element],
            duration: statusEffectsConfig[element].baseDuration,
            value: statusEffectsConfig[element].baseValue
          });
        }

        if (defender.statusEffects.length >= 2) break; // Maximum of 2 active status effects
            io.of("/game").in(duel._id.toString()).emit('statusEffectApplied', {
              defenderId:defender.userId?.toString(),
              attackerId:attacker.userId?.toString(),
              defenderMessage:`your ${defender.activeCard.petInfo.name} has been hit with the status effect ${statusEffects[element]} it lasts for ${statusEffectsConfig[element].baseDuration} rounds`,
              attackerMessage:`your ${attacker.activeCard.petInfo.name} has given  the status effect ${statusEffects[element]} to your opponent it lasts for ${statusEffectsConfig[element].baseDuration} rounds`,
               updatedGameState: duel
            });
      }
    }
  }
};  

const checkEffectsCheck = async (player, duel) => {
  let shouldSave = false;

  if (player.statusEffects.duration > 0) {
    switch (player.statusEffects.type) {
      case 'burn':
      case 'soak':
        player.health -= player.statusEffects.value;
        player.activePet.currentHealth -= player.statusEffects.value;
        io.of("/game").in(duel._id.toString()).emit('statusEffectChange', {
          forUser: player.userId?.toString(),
          message: `Your health and that of your ${player.activeCard.petInfo.name} have dropped by ${player.statusEffects.value}.`,
          statusEffects: player.statusEffects.type,
          updatedGameState: duel
        });
        shouldSave = true;
        break;
      case 'freeze':
      case 'petrify':
      case 'rooted':
        // Handle stunned logic
        duel.currentTurn = duel.currentTurn === "player1" ? "player2" : "player1";
        io.of("/game").in(duel._id.toString()).emit('statusEffectChange', {
          forUser: player.userId?.toString(),
          message: `Your turn has been skipped due to the ${player.statusEffects.type} status effect.`,
          statusEffects: player.statusEffects.type,
          updatedGameState: duel
        });
        shouldSave = true;
        break;
      case 'disorient':
      case 'fear':
      case 'dazzle':
        // Increase miss probability
        // Assuming missVariable is a property of player or duel, otherwise it should be passed to the function
        player.missVariable = (player.missVariable || 0) + 0.15;
        io.of("/game").in(duel._id.toString()).emit('statusEffectChange', {
          forUser: player.userId?.toString(),
          message: `Due to ${player.statusEffects.type}, your probability of missing has increased.`,
          statusEffects: player.statusEffects.type,
          updatedGameState: duel
        });
        shouldSave = true;
        break;
      case 'corrode':
        player.activePet.currentDefense -= player.statusEffects.value; // Reduce defense
        io.of("/game").in(duel._id.toString()).emit('statusEffectChange', {
          forUser: player.userId?.toString(),
          message: `Due to corrosion, your ${player.activePet.petInfo.name}'s defense has permanently dropped by ${player.statusEffects.value}.`,
          statusEffects: player.statusEffects.type,
          updatedGameState: duel
        });
        shouldSave = true;
        break;
      case 'shock':
        player.health -= player.statusEffects.value;
        player.activePet.currentHealth -= player.statusEffects.value;
        player.currentDeck.forEach(pet => pet.currentHealth -= player.statusEffects.value);
        io.of("/game").in(duel._id.toString()).emit('statusEffectChange', {
          forUser: player.userId?.toString(),
          message: `Due to chain shock, all health units on your side have dropped by ${player.statusEffects.value}.`,
          statusEffects: player.statusEffects.type,
          updatedGameState: duel
        });
        shouldSave = true;
        break;
    }
    player.statusEffects.duration -= 1;
  }

  if (player.activePet.currentHealth <= 0) {
    player.discardPile.push(player.activePet);
    player.activePet = player.currentDeck.shift();
    io.of("/game").in(duel._id.toString()).emit('statusEffectChange', {
      forUser: player.userId?.toString(),
      message: `Oops, your pet died and has been discarded.`,
      statusEffects: player.statusEffects.type,
      updatedGameState: duel
    });
    shouldSave = true;
  }

  if (player.statusEffects.duration <= 0) {
    player.statusEffects.duration = 0;
    player.statusEffects.type = [];
    player.statusEffects.value = 0;
    io.of("/game").in(duel._id.toString()).emit('statusEffectChange', {
      forUser: player.userId?.toString(),
      message: `Status effects have been lifted.`,
      statusEffects: player.statusEffects.type,
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

  return { strengthMultiplier, weaknessMultiplier };
};

const getRarityDefense = (rarity) => {
  switch (rarity) {
    case "Rustic":
      return 50;
    case "Arcane":
      return 40;
    case "Mythic":
      return 30;
    case "Exalted":
      return 20;
    case "Ethereal":
      return 10;
    default:
      return 50;
  }
};

const opponentClassCheck = (petClass, effectiveDefense, missVariable) => {
  const classChance = Math.random();
  switch (petClass) {
    case "Guardian":
      if (classChance <= 0.2) {
        return effectiveDefense * 2;
      }
      break;
    case "Nimble":
      if (classChance <= 0.2) {
        missVariable *= 1.5;
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
        return attackMultiplier * 2;
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

const endGame = async (duel, winnerId, loserId) => {
    const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();
  duel.isActive = false;
  duel.status = "completed";
  duel.winner = winnerId;
  duel.loser = loserId;
  
  duel.result = winnerId === player1Id ? 'player1' : 'player2';
  await duel.save();
  io.of("/game").in(duel._id.toString()).emit('gameEnd', {
    message: "The game has ended",
    winner: winnerId,
    loser: loserId,
    updatedGameState:duel
  });
     // Disconnect all players from the room
  const clients = io.of('/game').adapter.rooms.get(duel._Id) || [];
  clients.forEach(socketId => {
    io.of('/game').sockets.get(socketId).disconnect(true);
  });

  // Cleanup: Remove the room
  io.of('/game').adapter.rooms.delete(duel._Id);
 

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


const rewardPlayer = async (winnerId, currency, experience,duel) => {
  const user = await User.findById(winnerId);
  if (!user) return io.of("/game").in(duel._id.toString()).emit('notificationError', {
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

const loserPenalty = async (loserId, experience,duel) => {
  const user = await User.findById(loserId);
  if (!user) return io.of("/game").in(duel._id.toString()).emit('notificationError', {
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

const handleGameDraw = async (player1Id, player2Id, currency, experience, duel) => {
  const player1 = await User.findById(player1Id);
  const player2 = await User.findById(player2Id);
  if (!player1 ) return io.of("/game").in(duel._id.toString()).emit('notificationError', {
    message: "user with the Credentials does not exist",
    forUser: player1Id,
  });
  if ( !player2) return io.of("/game").in(duel._id.toString()).emit('notificationError', {
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

  io.of("/game").in(duel._id.toString()).emit('gameEnd', {
    winner:"draw",
    loser:"draw",
    message: "The game has ended in a draw",
  });

    // Disconnect all players from the room
  const clients = io.of('/game').adapter.rooms.get(duel._Id) || [];
  clients.forEach(socketId => {
    io.of('/game').sockets.get(socketId).disconnect(true);
  });

  // Cleanup: Remove the room
  io.of('/game').adapter.rooms.delete(duel._Id);

  // Clean up any room-specific resources or data if needed
  console.log(`Room ${duel._Id} has been closed and all players have been disconnected.`);

};

const handleEndOfGame = async (duel) => {
  const winner = winConditionCheck(duel);
  const rewards = duel.rewards;

   const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();
  if (winner) {
    if (winner === "draw") {
      await handleGameDraw(player1Id, player2Id, rewards.currency, rewards.experience, duel);
    } else {
      const winnerId = winner === 'player1' ? player1Id : player2Id;
      const loserId = winner === 'player1' ? player2Id : player1Id;
      await rewardPlayer(winnerId, rewards.currency, rewards.experience,duel);
      await loserPenalty(loserId, rewards.experience,duel);
      await endGame(duel, winnerId, loserId);
    }
  }
};



const userAction_Attack = async (socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;

    const user = await User.findById(playerId);
    if (!user) {
      return socket.of("/game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    const duel = await Duel.findById(duelId);
    if (!duel) {
      return socket.of("/game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }

    if (!duel.isActive) {
      return socket.of("/game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "The duel is no longer active.",
      });
    }
     const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    const isPlayerInDuel = [player1Id, player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return socket.of("/game").in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in this duel.",
      });
    }

    const currentPlayer = duel.currentTurn === "player1" ? duel.players.player1 : duel.players.player2;
    const opponentPlayer = duel.currentTurn === "player1" ? duel.players.player2 : duel.players.player1;

    if (opponentPlayer.playerStatus !== "connected") {
      return socket.in(duelId).emit('notificationError', {
        forUser: currentPlayer.userId?.toString(),
        message: "The opponent is not currently in the game. Await their return to continue.",
      });
    }

    if (currentPlayer.playerStatus !== "connected") {
      return socket.in(duelId).emit('notificationError', {
        forUser: currentPlayer.userId?.toString(),
        message: "You are not connected to the game. Reconnect to perform an action.",
      });
    }

    if (playerId !== currentPlayer.userId?.toString()) {
      return socket.of("/game").in(duelId).emit('notificationWarning', {
        forUser: currentPlayer.userId?.toString(),
        message: "It's not your turn.",
        updatedGameState: duel,
      });
    }

    let attackMultiplier = 1;
    let missVariable = 0.2;

    if (currentPlayer.mana < currentPlayer.activePet.manaCost) {
      duel.currentTurn = duel.currentTurn === "player1" ? "player2" : "player1";
      currentPlayer.mana += currentPlayer.activePet.manaCost * 0.7;
      await duel.save();
      return socket.of("/game").in(duelId).emit('notificationWarning', {
        forUser: currentPlayer.userId?.toString(),
        message: `You do not have enough mana to attack. Your turn has been skipped. ${currentPlayer.activePet.manaCost * 0.7} mana has been added to your mana.`,
        updatedGameState: duel,
      });
    }

    let opponentEffectiveDefense = opponentPlayer.activePet.currentDefense / getRarityDefense(opponentPlayer.activePet.rarity);

    opponentEffectiveDefense = opponentClassCheck(opponentPlayer.activePet.petInfo.class, opponentEffectiveDefense, missVariable);
    attackMultiplier = attackerClassCheck(currentPlayer.activePet.petInfo.class, attackMultiplier);

    const { strengthMultiplier, weaknessMultiplier } = calculateElementMultiplier(currentPlayer.activePet.petInfo.element, opponentPlayer.activePet.petInfo.element);
    attackMultiplier *= strengthMultiplier;
    opponentEffectiveDefense *= weaknessMultiplier;

    if (missCheck(missVariable)) {
      attackMultiplier = 0;
    }

    let getManaBack = currentPlayer.activePet.manaCost * 0.5;

    applyElementalStatusEffect(currentPlayer.activePet, opponentPlayer.activePet, duel);
    await checkEffectsCheck(currentPlayer, duel);
    await checkEffectsCheck(opponentPlayer, duel);

    let damage = currentPlayer.activePet.currentAttack * attackMultiplier - opponentEffectiveDefense;
    if (opponentPlayer.isDefending) {
      damage /= 10;
    }

    if (damage > opponentPlayer.activePet.currentHealth) {
      const remainingDamage = damage - opponentPlayer.activePet.currentHealth;
      opponentPlayer.health -= remainingDamage;
      opponentPlayer.activePet.currentHealth = 0;
      opponentPlayer.discardPile.push(opponentPlayer.activePet);
      opponentPlayer.activePet = opponentPlayer.pets.currentDeck[0];
      opponentPlayer.pets.currentDeck = opponentPlayer.pets.currentDeck.slice(1);
      getManaBack = currentPlayer.activePet.manaCost * 0.8;
    } else {
      opponentPlayer.activePet.currentHealth -= damage;
    }

    currentPlayer.mana -= currentPlayer.activePet.manaCost;
    currentPlayer.mana += getManaBack;
    opponentPlayer.isDefending = false;
    duel.noOfTurns++;
    duel.currentTurn = duel.currentTurn === "player1" ? "player2" : "player1";

    await handleEndOfGame(duel);
    await duel.save();

    socket.to(duelId).emit('attackResult', {
      forUser: currentPlayer.userId?.toString(),
      message: `Player ${currentPlayer.username} performed an attack. Your ${currentPlayer.activePet.petInfo.name} dealt ${damage} damage to the opponent's ${opponentPlayer.activePet.petInfo.name}.`,
      updatedGameState: duel,
    });
  } catch (error) {
    logger.error("Error during attack action:", error);
    socket.emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while performing the attack.",
    });
  }
};


const userAction_Defend = async (socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;

    const user = await User.findById(playerId);
    if (!user) {
      return socket.in(sessionID).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    const duel = await Duel.findById(sessionID);
    if (!duel) {
      return socket.in(sessionID).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }

    if (!duel.isActive) {
      return socket.in(sessionID).emit('notificationError', {
        forUser: playerId,
        message: "The duel is no longer active.",
      });
    }
     const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    const isPlayerInDuel = [player1Id,player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return socket.in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    const currentPlayer = duel.currentTurn === "player1" ? duel.players.player1 : duel.players.player2;
    const opponentPlayer = duel.currentTurn === "player1" ? duel.players.player2 : duel.players.player1;

    if (opponentPlayer.playerStatus !== "connected") {
      return socket.in(duelId).emit('notificationError', {
        forUser: currentPlayer.userId?.toString(),
        message: "The opponent is not currently in the game. Await their return to continue.",
      });
    }

    if (currentPlayer.playerStatus !== "connected") {
      return socket.in(duelId).emit('notificationError', {
        forUser: currentPlayer.userId?.toString(),
        message: "You are not connected to the game. Reconnect to perform an action.",
      });
    }

    if (playerId !== currentPlayer.userId?.toString()) {
      return socket.in(duelId).emit('notificationWarning', {
        forUser: currentPlayer.userId?.toString(),
        message: "It's not your turn.",
        updatedGameState: duel,
      });
    }

    await checkEffectsCheck(currentPlayer.activePet, duel);
    await checkEffectsCheck(opponentPlayer.activePet, duel);

    if (currentPlayer.isDefend) {
      return socket.in(duelId).emit('notificationWarning', {
        forUser: currentPlayer.userId?.toString(),
        message: "Cannot defend while defense is already active.",
        updatedGameState: duel,
      });
    }

    currentPlayer.isDefend = true;
    currentPlayer.mana -= currentPlayer.activePet.manaCost * 0.4;
    const getManaBack = currentPlayer.activePet.manaCost * 0.5; // Adjust this value as needed
    currentPlayer.mana += getManaBack;

    duel.noOfTurns++;
    duel.currentTurn = duel.currentTurn === "player1" ? "player2" : "player1";

    await handleEndOfGame(duel);
    await duel.save();

    socket.to(duelId).emit('defendResult', {
      forUser: currentPlayer.userId?.toString(),
      message: `Player ${currentPlayer.username} performed a defend action.`,
      updatedGameState: duel,
    });
  } catch (error) {
    logger.error("Error during defend action:", error);
    socket.emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while performing the defend action.",
    });
  }
};

const userAction_LeaveActiveDuel = async (socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;

    // Fetch user by ID
    const user = await User.findById(playerId);
    if (!user) {
      return socket.in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a user.",
      });
    }

    // Fetch duel by ID
    const duel = await Duel.findById(duelId);
    if (!duel) {
      return socket.in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }

    // Check if duel is active
    if (!duel.isActive) {
      return socket.in(duelId).emit('notificationError', {
        forUser: playerId,
        message: "The duel is no longer active.",
      });
    } const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    // Check if the user is a player in the duel
    const isPlayerInDuel = [player1Id, player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return socket.in(duelId).emit('notificationError', {
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

    await rewardPlayer(winnerId, rewards.currency, rewards.experience,duel);
    await loserPenalty(loserId, rewards.experience,duel);
    await endGame(duel, winnerId, loserId);

  } catch (error) {
    logger.error("Error leaving duel:", error);
    socket.emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while leaving the duel.",
    });
  }
};


const GameLogic_HandlePlayerDisconnect = async (socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;

    // Fetch user by ID
    const user = await User.findById(playerId);
    if (!user) {
      return socket.to(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a user.",
      });
    }

    // Fetch duel by ID
    const duel = await Duel.findById(duelId);
    if (!duel) {
      return socket.to(duelId).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }
    const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    // Check if the user is a player in the duel
    const isPlayerInDuel = [player1Id, player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return socket.to(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }

    // Check if duel is completed
    if (duel.status === "completed") {
      return socket.to(duelId).emit('notificationError', {
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
          io.to(roomId).emit('opponentDisconnected', {
            message: `${currentPlayer.username} disconnected`,
            updatedGameState: duel
          });

          // Logic to declare opponent as the winner
          const rewards = duel.rewards;
          const winnerId = opponentPlayer.userId?.toString();
          const loserId = currentPlayer.userId?.toString();

          await rewardPlayer(winnerId, rewards.currency, rewards.experience,duel);
          await loserPenalty(loserId, rewards.experience,duel);
          await endGame(duel, winnerId, loserId);

          // Update duel status to completed
          duel.status = "completed";
          duel.isActive = false;
          await duel.save();

          // Notify both players about the game end
          socket.to(duelId).emit('gameEnded', {
            winnerId: winnerId,
            loserId: loserId,
            message: "The game has ended due to player disconnection."
          });
        }
      }
    }, 2 * 60 * 1000); // 2 minutes

  } catch (error) {
    logger.error("Error handling player disconnect:", error);
    socket.emit('notificationError', {
      forUser: data.userId?.toString(),
      message: "An error occurred while handling the player disconnect.",
    });
  }
};

const GameLogic_HandlePlayerReconnect = async (socket, data) => {
  try {
    const { userId, sessionID } = data;
    const playerId = userId;
    const duelId = sessionID;



    const duel = await Duel.findById(duelId);
    if (!duel) {
      console.log(`No duel found for id ${duelId}`);
      return socket.to(duelId).emit('notificationError', {
        forUser: playerId,
        message: "No duel found.",
      });
    }

    const player1Id = duel.players.player1?.userId?.toString();
    const player2Id = duel.players.player2?.userId?.toString();

    // Check if the user is a player in the duel
    const isPlayerInDuel = [player1Id, player2Id].includes(playerId);
    if (!isPlayerInDuel) {
      return socket.to(duelId).emit('notificationError', {
        forUser: playerId,
        message: "You are not a player in the duel.",
      });
    }
    if(duel.status === "completed"){
     socket.to(duelId).emit('notificationError', {
        forUser: playerId,
        message: "The duel has ended.",
      });
    
   const rewards = duel.rewards;
          const winnerId = opponentPlayer.userId?.toString();
          const loserId = currentPlayer.userId?.toString();

          await rewardPlayer(winnerId, rewards.currency, rewards.experience,duel);
          await loserPenalty(loserId, rewards.experience,duel);
          await endGame(duel, winnerId, loserId);

          // Update duel status to completed
          duel.status = "completed";
          duel.isActive = false;
          await duel.save();

          // Notify both players about the game end
          socket.to(duelId).emit('gameEnded', {
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


    await duel.save();

console.log(duelId);
    socket.to(duelId).emit('notification',`player ${currentPlayer.username} has reconnected to the game.`,
    );

  } catch (error) {
    console.error("Error handling player reconnect:", error);
    socket.emit('notificationError', {
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