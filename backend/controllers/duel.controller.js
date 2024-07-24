const User = require("../models/user.model");
const Duel = require("../models/duel.model.js")
const Pets = require("../models/pet.model.js")
const Arena =require("../models/arena.model.js")
const PetsLibary = require("../models/petLibary.model.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP =require("../models/otp.model")
const crypto =require("crypto")
const mailer = require("../utils/sendMailConfig");
const { getSocketInstance } = require('../utils/socketio');
const logger = require('../logger');


const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let code = '';

  // Generate random bytes (secure random number) and map them to characters
  for (let i = 0; i < codeLength; i++) {
    // Generate random byte (0 to 255)
    const randomByte = crypto.randomBytes(1)[0];
    
    // Map the random byte to a character from the defined set
    const characterIndex = randomByte % characters.length;
    code += characters.charAt(characterIndex);
  }

  return code;
};


const createDuel = async (req, res, next) => {
  try {
    const playerOneId = req.user.id;
    const { isPrivate } = req.body;
    const io = getSocketInstance()

    const Arenas = ["669a9129a063f66e717131cd", "669a9129a063f66e717131d3", "669a9129a063f66e717131d6"];

    // Check for active duels
    const inActiveDuelCheck = await Duel.find({
      'players.player1.userId': playerOneId,
      isActive: true,
      $or: [{ status: "pending" }, { status: "ongoing" }]
    });

    if (inActiveDuelCheck.length > 0) {
      return res.status(400).json({  message: "You are already in an existing duel." });
    }

    // Ensure there are arenas available
    if (Arenas.length === 0) {
      return res.status(400).json({  message: "No arenas available." });
    }

    // Randomly select who starts the duel
    const rand = Math.random();
    let whoStarts = "player1";
    if (rand > 0.6) {
      whoStarts = "player2";
    }

    const randomArenasIndex = Math.floor(Math.random() * Arenas.length);
    const randomArena = Arenas[randomArenasIndex];
    const duelJoinKey = generateRandomCode();


      const arena = await Arena.findById( randomArena);
    if (!arena) {
      return res.status(404).json({  message: "Arena  does not exist." });
    }

    // Find user and populate current deck
    const user = await User.findById(playerOneId).populate({
      path: 'pets.currentDeck',
      populate: {
        path: 'petInfo',
        select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
      }
    });
    if (!user) {
      return res.status(404).json({  message: "User with the provided credential does not exist." });
    }

    // Deck size by rank
    const deckSizeByRank = {
      "Unranked": 10,
      "Rustic": 10,
      "Arcane": 15,
      "Mythic": 20,
      "Exalted": 25,
      "Ethereal": 30
    };

    const requiredDeckSize = deckSizeByRank[user.playerRank];
    if (user.pets.currentDeck.length !== requiredDeckSize) {
      return res.status(400).json({  message: `User deck size must be ${requiredDeckSize} cards for rank [${user.playerRank}.]` });
    }
    

    // Element buffs
    const elementBuffs = {
         Light: (pet) => { 
        pet.currentHealth = Math.round(pet.currentHealth + 20); 
    },
    Dark: (pet) => { 
        pet.currentManaCost = Math.round(Math.max(pet.currentManaCost - 5, 0)); 
    },
    Nature: (pet) => { 
        pet.currentHealth = Math.round(pet.currentHealth * 1.3); 
    }
    };

    // Check if user has specific elements
    const hasElement = (element) => user.pets.currentDeck.some(pet => pet.petInfo.element.includes(element));

    // Apply buffs
    let lightBuff = 1;
    let darkBuff = 1;

    if (hasElement('Light')) {
      user.pets.currentDeck.forEach(pet => elementBuffs.Light(pet));
      lightBuff = 1.1;
    }

    if (hasElement('Dark')) {
      user.pets.currentDeck.forEach(pet => elementBuffs.Dark(pet));
      darkBuff = 1.25;
    }

    if (hasElement('Nature')) {
      user.pets.currentDeck.forEach(pet => elementBuffs.Nature(pet));
    }

    // Rank multiplier
    const getRankMultiplier = (rank) => {
      switch (rank) {
        case "Rustic": return 1;
        case "Arcane": return 1.2;
        case "Mythic": return 1.4;
        case "Exalted": return 1.6;
        case "Ethereal": return 1.8;
        case "Unranked": return 0.8;
        default: return 1;
      }
    };

    const userHealth = Math.round(Math.min(500 * getRankMultiplier(user.playerRank) * lightBuff, 2500));
    const userManaPool = Math.round(Math.min(100 * getRankMultiplier(user.playerRank) * darkBuff, 1500));

    // Set the active card and adjust the current deck
    const activeCard = user.pets.currentDeck[0];
    const currentDeck = user.pets.currentDeck.slice(1);

    const turnLimit = Math.min(requiredDeckSize * 3, 200);

    // Determine rank range for matchmaking
    let rankRange = [];
    switch (user.playerRank) {
      case "Unranked":
        rankRange = ["Unranked", "Rustic"];
        break;
      case "Rustic":
        rankRange = ["Rustic", "Arcane"];
        break;
      case "Arcane":
        rankRange = ["Rustic", "Arcane", "Mythic"];
        break;
      case "Mythic":
        rankRange = ["Arcane", "Mythic", "Exalted"];
        break;
      case "Exalted":
        rankRange = ["Mythic", "Exalted", "Ethereal"];
        break;
      case "Ethereal":
        rankRange = ["Exalted", "Ethereal"];
        break;
      default:
        rankRange = ["Rustic"];
    }

    // Prepare player data
    const player1Data = {
      userId: playerOneId,
      username: user.username,
      playerStatus: "connected",
      profileIMG:user.profile.avatar,
      currentDeck: currentDeck,
      discardPile: [],
      manaPool: userManaPool,
      health: userHealth,
      rank: user.playerRank,
      activePet: activeCard
    };

  function ensureSingleStringArray(element) {
    // Flatten the array if it contains nested arrays
    const flattened = Array.isArray(element) ? element.flat(Infinity) : [element];

    // Ensure all elements are strings
    const stringArray = flattened.map(String);

    return stringArray;
}


const arenaElements = ensureSingleStringArray(arena.element);

    // Create a new duel
    let duel = new Duel({
       arena:{
          arenaId: randomArena,
    arenaImage:arena.imageUrl,
    arenaElement:arenaElements,
    arenaName:arena.name,
    arenaDescription:arena.description,
    },
      players: {
        player1: player1Data
      },
      isPrivate: isPrivate,
      duelJoinKey: duelJoinKey,
      currentTurn: whoStarts,
      rankRange: rankRange,
      deckSize: requiredDeckSize,
      turnLimit: turnLimit
    });

    // Save the duel to the database
    duel = await duel.save();

    // Respond with success message and the created duel object
    res.status(201).json({

      message: "Duel Created awaiting another player.",
      duel: duel
    });

  } catch (error) {
    console.error("Error creating duel:", error);
    res.status(500).json({  message: "An error occurred while creating the duel." });
    next(error);
  }
};

const joinDuel = async (req, res, next) => {
  try {
    const playerTwoId = req.user.id;
    const { duelJoinKey } = req.body;
const io = getSocketInstance()
    const rankRanges = {
      "Unranked": ["Unranked", "Rustic"],
      "Rustic": ["Rustic", "Arcane"],
      "Arcane": ["Rustic", "Arcane", "Mythic"],
      "Mythic": ["Arcane", "Mythic", "Exalted"],
      "Exalted": ["Mythic", "Exalted", "Ethereal"],
      "Ethereal": ["Exalted", "Ethereal"]
    };

    const rewardMultipliers = {
      "Unranked": { currency: 0.5, xp: 0.5 },
      "Rustic": { currency: 1, xp: 1 },
      "Arcane": { currency: 1.2, xp: 1.2 },
      "Mythic": { currency: 1.4, xp: 1.4 },
      "Exalted": { currency: 1.6, xp: 1.6 },
      "Ethereal": { currency: 1.8, xp: 1.8 }
    };

    // Find the user and populate their current deck with selected fields from petInfo
    const user = await User.findById(playerTwoId).populate({
      path: 'pets.currentDeck',
      populate: {
        path: 'petInfo',
        select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
      }
    });

    if (!user) {
      return res.status(404).json({  message: "User with the provided credential does not exist." });
    }

    let duel;

    if (duelJoinKey && duelJoinKey !== "") {
      duel = await Duel.findOne({ duelJoinKey });
      if(!duel){
        return res.status(404).json({  message: 'No matching duels found.' });
      }

    } else {
      const rankRange = rankRanges[user.playerRank] || ["Rustic"];
      const duels = await Duel.find({
        isOpen: true,
        isPrivate: false,
        isActive: true,
        status: "pending",
        rankRange: { $in: rankRange }
      });

      if (duels.length === 0) {
        return res.status(404).json({  message: 'No matching duels found.' });
      }

      const randomIndex = Math.floor(Math.random() * duels.length);
      duel = duels[randomIndex];
    }

    if (!duel) {
      return res.status(404).json({  message: 'No matching duel found.' });
    }

    if (duel.players.player2.userId === playerTwoId) {
      return res.status(403).json({ message: 'Cannot join duel. You are already in it.' });
    }
    if (!duel.isOpen) {
      return res.status(403).json({  message: 'Cannot join duel. It is not open.' });
    }

    if (!duel.isActive) {
      return res.status(403).json({  message: 'Cannot join duel. It is not active.' });
    }
    if (duel.status !== "pending") {
      return res.status(403).json({  message: 'Cannot join duel. The duel has started.' });
    }

    const deckSizeByRank = {
      "Unranked": 10,
      "Rustic": 10,
      "Arcane": 15,
      "Mythic": 20,
      "Exalted": 25,
      "Ethereal": 30
    };

    const requiredDeckSize = deckSizeByRank[user.playerRank];
    if (user.pets.currentDeck.length !== requiredDeckSize) {
      return res.status(400).json({  message: `User deck size must be ${requiredDeckSize} cards for rank ${user.playerRank}.` });
    }

    let lightBuff = 1;
    let darkBuff = 1;

    // Define element buffs
    const elementBuffs = {
       Light: (pet) => { 
        pet.currentHealth = Math.round(pet.currentHealth + 20); 
    },
    Dark: (pet) => { 
        pet.currentManaCost = Math.round(Math.max(pet.currentManaCost - 5, 0)); 
    },
    Nature: (pet) => { 
        pet.currentHealth = Math.round(pet.currentHealth * 1.3); 
    }
    };

    const hasElement = (element) => user.pets.currentDeck.some(pet => pet.petInfo.element.includes(element));

    if (hasElement('Light')) {
      user.pets.currentDeck.forEach(pet => elementBuffs.Light(pet));
      lightBuff = 1.1;
    }

    if (hasElement('Dark')) {
      user.pets.currentDeck.forEach(pet => elementBuffs.Dark(pet));
      darkBuff = 1.25;
    }

    if (hasElement('Nature')) {
      user.pets.currentDeck.forEach(pet => elementBuffs.Nature(pet));
    }

    const getRankMultiplier = (rank) => {
      switch (rank) {
        case "Ethereal":
          return 1.8;
        case "Exalted":
          return 1.6;
        case "Mythic":
          return 1.4;
        case "Arcane":
          return 1.2;
        case "Rustic":
          return 1;
        case "Unranked":
          return 0.8;
        default:
          return 1;
      }
    };

   const userHealth = Math.round(Math.min(500 * getRankMultiplier(user.playerRank) * lightBuff, 2500));
    const userManaPool = Math.round(Math.min(100 * getRankMultiplier(user.playerRank) * darkBuff, 1500));

    const activeCard = user.pets.currentDeck[0];
    const currentDeck = user.pets.currentDeck.slice(1);

    const calculateAverageRewardMultiplier = (rankRange) => {
      let totalCurrencyMultiplier = 0;
      let totalXpMultiplier = 0;
      let count = 0;

      rankRange.forEach(rank => {
        if (rewardMultipliers[rank]) {
          totalCurrencyMultiplier += rewardMultipliers[rank].currency;
          totalXpMultiplier += rewardMultipliers[rank].xp;
          count++;
        }
      });

      const averageCurrencyMultiplier = count > 0 ? totalCurrencyMultiplier / count : 1;
      const averageXpMultiplier = count > 0 ? totalXpMultiplier / count : 1;

      return { currency: averageCurrencyMultiplier, xp: averageXpMultiplier };
    };

    const { currency, xp } = calculateAverageRewardMultiplier(duel.rankRange);

    const baseRewardCurrency = 100;
    const baseRewardXp = 100;

    const rewardCurrency = baseRewardCurrency * currency;
    const rewardXp = baseRewardXp * xp;

    const player2Data = {
      userId: playerTwoId,
      username: user.username,
      playerStatus: "connected",
      profileIMG:user.profile.avatar,
      currentDeck: currentDeck,
      discardPile: [],
      manaPool: userManaPool,
      health: userHealth,
      rank: user.playerRank,
      activePet: activeCard
    };

    duel.players.player2 = player2Data;
    duel.isOpen = false;
    duel.status = "ongoing";
    duel.rewards = { currency: rewardCurrency, experience: rewardXp };

    await duel.save();
    const data = { message: "Game has started", gameState: duel }

    console.log(duel._id.toString());
    io.of("/game").to(duel._id.toString()).emit('notification', 'An opponent has joined the duel.');
    io.of("/game").to(duel._id.toString()).emit('notification', `${user.username} has successfully joined. The duel is starting... 5s`);
    
    const TIMEOUT_DURATION = 5000; // 5 seconds
    setTimeout(() => {
      io.of("/game").in(duel._id.toString()).emit('gameStart', data );
    }, TIMEOUT_DURATION);

    res.status(200).json({
      
      message: "Successfully joined the duel. The game has started.",
      duel: duel
    });
  } catch (error) {
    logger.error("Error joining duel:", error);
    res.status(500).json({  message: "An error occurred while joining the duel." });
    next(error);
  }
};

const closeDuelB4Ongoing = async (req, res, next) => {
  try {
    const { duelId } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User with the provided credential does not exist." });
    }

    const duel = await Duel.findById(duelId);
    
    if (!duel) {
      return res.status(404).json({ message: "Duel does not exist." });
    }

    const player1Id = duel.players.player1?.userId?.toString();
   
    if (player1Id !== userId) {
      return res.status(403).json({ message: "You cannot close another room." });
    }

    if (duel.status === "ongoing") {
      return res.status(403).json({ message: "You cannot close an ongoing game. Consider leaving it instead." });
    }

    await duel.deleteOne();
    return res.status(200).json({ message: "Duel successfully closed." });
  } catch (error) {
    logger.error("Error closing duel:", error);
    res.status(500).json({ message: "An error occurred while closing the duel." });
    next(error);
  }
};






module.exports = {
    createDuel,
    joinDuel,
    closeDuelB4Ongoing
};