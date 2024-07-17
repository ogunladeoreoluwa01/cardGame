const PetsLibary = require("../models/petLibary.model.js")


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

module.exports = {
  createPet,
};