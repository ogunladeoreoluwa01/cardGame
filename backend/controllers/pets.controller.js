const PetLibrary = require("../models/petLibary.model.js")
const Market = require("../models/market.model.js")
const Pets= require("../models/pet.model.js")
const User = require("../models/user.model");
const crypto =require("crypto")

const generateUniqueCode = (userId) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let code = '';
  // Generate random bytes and map them to characters
  for (let i = 0; i < codeLength; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    const characterIndex = randomByte % characters.length;
    code += characters.charAt(characterIndex);
  }
  // Create a hash of the userId and random code
  const hash = crypto.createHash('sha256').update(userId + code).digest('hex');
  const uniquePart = hash.slice(0, 4).toUpperCase(); // Take the first 6 characters for uniqueness

  return `${code.slice(0, 4)}${uniquePart}`;
};

// Create a new pet
const createPet = async (req, res) => {
  const {
    name,
    baseHealth,
    baseAttack,
    baseDefense,
    baseManaCost,
    baseCost,
    illustration,
    description,
    class: petClass,
    classBonus,
    lore,
    elementalBonus,
    element,
    weaknesses,
    strengths
  } = req.body;

  try {
    // Check if a pet with the same name already exists
    const existingPet = await PetLibrary.findOne({ name });
    if (existingPet) {
      return res.status(400).json({ message: 'Pet name already exists' });
    }

    // Create a new pet instance
    const newPetLibrary = new PetLibrary({
      name,
      baseHealth,
      baseAttack,
      baseDefense,
      baseManaCost,
      baseCost,
      illustration,
      description,
      class: petClass,
      classBonus,
      lore,
      elementalBonus,
      element,
      weaknesses,
      strengths
    });

    // Save the new pet to the database
    const savedPet = await newPetLibrary.save();
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getAPetDetails = async (req, res) => {
  const { petId } = req.params;
  try {
    // Find the pet by ID and populate the necessary fields
    const pet = await Pets.findById(petId).populate({
      path: 'petInfo',
      select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Respond with the pet details
    res.status(200).json({
      message: "Pet found successfully.",
      pet: pet,
    });
  } catch (error) {
    console.error("Error fetching pet details:", error);
    res.status(500).json({ message: "An error occurred while fetching pet details." });
    
  }
};

const getAllUserPets = async (req, res, next) => {
  const searcherId = req.user.id;
  const userId = req.params.userId;
  const { element, rarity, petClass, isLvl = "highest", petcategory = "all-pets" ,petname} = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const searcher = await User.findById(searcherId);
    if (!searcher) {
      return res.status(404).json({ message: "Searcher not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    let sort = { level: -1 };
    if (isLvl === "lowest") {
      sort = { level: 1 };
    }

    let query = { 'userProfile.userId': userId };
    let match = {};

    if (element) {
      match.element = { $elemMatch: { $eq: element } };
    }

    if (petClass) {
      match.class = { $in: petClass };
    }

    if(petname){
      match.name = {$regex: petname, $options: 'i'};
    }
    if (rarity) {
      query.rarity = rarity;
    }

    if (petcategory === "current-deck") {
      query._id = { $in: user.pets.currentDeck };
    } else if (petcategory === "available-pets") {
      query._id = { $in: user.pets.availablePets };
    }

    const skip = (page - 1) * limit;

    const pets = await Pets.find(query)
      .populate({
        path: 'petInfo',
        select: '-baseHealth -baseAttack -baseDefense -baseManaCost',
        match: match
      })
      .sort(sort)
    

    const filteredPets = pets.filter(pet => pet.petInfo !== null);

    const paginatedPets =filteredPets.slice(skip, skip + limit)

    const totalPets = await Pets.countDocuments(query);

    const ElementsArray = ["Light", "Shadow", "Fire", "Water", "Earth", "Metal", "Air", "Lightning", "Ice", "Nature"];

    const elementCountsPromises = ElementsArray.map(async (element) => {
      const elementPets = await Pets.find({ 'userProfile.userId': userId })
        .populate({
          path: 'petInfo',
         match: { element: { $elemMatch: { $eq: element } } }
        })
        .exec();

      const filteredElementPets = elementPets.filter(pet => pet.petInfo !== null);

      return {
        element: element,
        count: filteredElementPets.length
      };
    });

    const ElementCounts = await Promise.all(elementCountsPromises);

    res.status(200).json({
      message: "Pets found successfully.",
      pets: paginatedPets,
      elementCounts: ElementCounts,
      pagination: {
        totalItems: totalPets,
        totalPages: Math.ceil(totalPets / limit),
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    console.error("Error fetching pets details:", error);
    res.status(500).json({ message: "An error occurred while fetching pets details." });
    next(error);
  }
};

const getUsersCurrentDeck = async (req, res, next) => {
  const searcherId = req.user.id; // ID of the user making the request
  const targetUserId = req.params.userId; // ID of the user whose deck is being requested

  // Define deck size limits based on user rank
  const deckSizeLimits = {
    "Wood": 10,
    "Onyx": 10,
    "Bronze": 15,
    "Silver": 20,
    "Gold": 20,
    "Ruby": 25,
    "Master": 30,
    "Amethyst": 30,
  };

  try {
    // Fetch the searcher (requesting user) by their ID
    const searcher = await User.findById(searcherId);
    if (!searcher) {
      return res.status(404).json({ message: "Searcher not found." });
    }

    // Fetch the target user by their ID
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prepare the query to fetch pets in the target user's current deck
    let petQuery = { _id: { $in: targetUser.pets.currentDeck } };

    // Fetch the pets in the current deck with specific pet information excluded
    const currentDeckPets = await Pets.find(petQuery)
      .populate({
        path: 'petInfo',
        select: '-baseHealth -baseAttack -baseDefense -baseManaCost', // Exclude base stats from the pet info
      });

    // Get the maximum deck size allowed based on the target user's rank
    const maxDeckSize = deckSizeLimits[targetUser.playerRank];

    // Respond with the fetched pets and the user's max deck size
    res.status(200).json({
      message: "Current deck retrieved successfully.",
      currentDeck: currentDeckPets,
      maxDeckSize: maxDeckSize,
    });
  } catch (error) {
    console.error("Error fetching pets details:", error);
    res.status(500).json({ message: "An error occurred while fetching the current deck." });
    next(error);
  }
};




const editCurrentDeck = async (req, res, next) => {
  const userId = req.user.id;
  const { primaryPetId, secondaryPetId } = req.body;

  const deckSizeLimits = {
    "Wood": 10,
    "Onyx": 10,
    "Bronze": 15,
    "Silver": 20,
    "Gold": 20,
    "Ruby": 25,
    "Master": 30,
    "Amethyst": 30,
  };

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const primaryPet = await Pets.findById(primaryPetId);
    if (!primaryPet) return res.status(404).json({ message: "Primary pet not found." });

    if (userId !== primaryPet.userProfile.userId.toString()) {
      return res.status(400).json({ message: "You do not own this pet." });
    }

    if (!user.pets.availablePets.includes(primaryPetId)) {
      return res.status(400).json({ message: "Primary pet is not available." });
    }

    const maxDeckSize = deckSizeLimits[user.playerRank];

    if (secondaryPetId) {
      const secondaryPet = await Pets.findById(secondaryPetId);
      if (!secondaryPet) return res.status(404).json({ message: "Secondary pet not found." });

      if (primaryPetId === secondaryPetId) {
        return res.status(400).json({ message: "The same pet cannot be added twice." });
      }

      const secondaryPetIndex = user.pets.currentDeck.indexOf(secondaryPetId);
      if (secondaryPetIndex > -1) {
        user.pets.currentDeck.splice(secondaryPetIndex, 1);
      }

      const primaryPetIndex = user.pets.availablePets.indexOf(primaryPetId);
      if (primaryPetIndex > -1) {
        user.pets.availablePets.splice(primaryPetIndex, 1);
      }

      user.pets.availablePets.push(secondaryPetId);
      user.pets.currentDeck.push(primaryPetId);
    } else {
      if (user.pets.currentDeck.length >= maxDeckSize) {
        const lastPetInDeck = user.pets.currentDeck.pop();
        if (lastPetInDeck) {
          user.pets.availablePets.push(lastPetInDeck);
        }
      }

      const primaryPetIndex = user.pets.availablePets.indexOf(primaryPetId);
      if (primaryPetIndex > -1) {
        user.pets.availablePets.splice(primaryPetIndex, 1);
      }
      user.pets.currentDeck.push(primaryPetId);
    }

    await user.save();
    res.status(200).json({ message: "Deck updated successfully." });
  } catch (error) {
    console.error("Error updating the pet deck:", error);
    res.status(500).json({ message: "An error occurred while updating the pet deck." });
    next(error);
  }
};
    










const addPetToMarketPlace = async () => {
   const maxAttempts = 2;
  let attempt = 0;

  while (attempt < maxAttempts) {
 try {
  attempt++;
    console.log("started")
    const pets = await PetLibrary.find();

    if (!pets) {
      return console.log("No pets found in the library.");
    }

    for (const pet of pets) {
      const petData = new Pets({
        petInfo: pet._id,
        isSystemOwned: true
        
      });

      const savedPet = await petData.save();
      const listingCode = `S-${generateUniqueCode(savedPet._id)}`;
    
    

      const newMarketPet = new Market({
        listingNumber: listingCode,
        listingCategory: 'pet',
        petId: savedPet._id,
        priceInSilver: savedPet.currentCost,
        sideNote: savedPet.lore,
        isSystem: true
      });

      const market = await newMarketPet.save();

      if (market) {
      savedPet.isListed = true;
      savedPet.listingNo = listingCode
      savedPet.listingPrice = savedPet. currentCost
        await savedPet.save();
      }
    }
  } catch (error) {

    console.log("Error adding pet to marketplace:", error.message);
  }
  }
 
};





module.exports = {
  createPet,
  getAPetDetails,
  getAllUserPets,
  addPetToMarketPlace,
  getUsersCurrentDeck,
  editCurrentDeck
};
