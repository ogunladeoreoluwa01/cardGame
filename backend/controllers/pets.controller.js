const PetsLibary = require("../models/petLibary.model.js")
const Pets= require("../models/pet.model.js")
const User = require("../models/user.model");
// Create a new pet
const createPet = async (req, res) => {
  const {
    name,
    baseHealth,
    baseAttack,
    baseDefense,
    baseManaCost,
    illustration,
    description,
    class: petClass,
    classBonus,
    elementalBonus,
    element,
    weaknesses,
    strengths
  } = req.body;

  try {
    // Check if a pet with the same name already exists
    const existingPet = await PetsLibary.findOne({ name });
    if (existingPet) {
      return res.status(400).json({ message: 'Pet name already exists' });
    }

    // Create a new pet instance
    const newPetsLibary = new PetsLibary({
      name,
      baseHealth,
      baseAttack,
      baseDefense,
      baseManaCost,
      illustration,
      description,
      class: petClass,
      classBonus,
      elementalBonus,
      element,
      weaknesses,
      strengths
    });

    // Save the new pet to the database
    const savedPet = await newPetsLibary.save();
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getAPetDetails = async (req, res, next) => {
  const { petId } = req.body;
  const { userId } = req.user.id;

  try {
    // Find the pet by ID and populate the necessary fields
    const pet = await Pets.findById(petId).populate({
      path: 'petInfo',
      select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User with the provided credentials does not exist." });
    }

    // Respond with the pet details
    res.status(200).json({
      message: "Pet found successfully.",
      pet: pet,
    });
  } catch (error) {
    console.error("Error fetching pet details:", error);
    res.status(500).json({ message: "An error occurred while fetching pet details." });
    next(error);
  }
};

const getAllUserPets = async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User with the provided credentials does not exist." });
    }
    // Find all pets by userProfile.userId and populate the necessary fields
    const pets = await Pets.find({ 'userProfile.userId': userId }).populate({
      path: 'petInfo', // Populate the petInfo directly if it's a single reference
      select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
    });

    if (!pets || pets.length === 0) {
      return res.status(404).json({ message: 'No pets found for this user' });
    }

    // Respond with the pets details
    res.status(200).json({
      message: "Pets found successfully.",
      pets: pets,
    });
  } catch (error) {
    console.error("Error fetching pets details:", error);
    res.status(500).json({ message: "An error occurred while fetching pets details." });
    next(error);
  }
};


module.exports = {
  createPet,
  getAPetDetails,
  getAllUserPets,
};