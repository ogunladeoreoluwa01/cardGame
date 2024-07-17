const Arena = require("../models/arena.model");



const createArena = async (req, res) => {
  try {
    const { name, description, element,imageUrl } = req.body;

    
    const newArena = new Arena({
      
      name,
      description,
      element,
      imageUrl
    });

     const existingArena = await Arena.findOne({ name });
    if (existingArena) {
      return res.status(400).json({ message: 'Arena name already exists' });
    }
    const savedArena = await newArena.save();
    res.status(201).json(savedArena);
  

  } catch (error) {
    console.error("Error during user registration:", error); // Log the error details
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};








module.exports = {
   createArena
};