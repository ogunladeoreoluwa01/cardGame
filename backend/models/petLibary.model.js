const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the PetLibrary schema
const petLibrarySchema = new Schema(
  {
    name: { type: String, required: true,  },
    baseHealth: { type: Number, required: true },
    baseAttack: { type: Number, required: true },
    baseDefense: { type: Number, required: true },
    baseManaCost: { type: Number, required: true },
    baseCost: { type: Number, required: true },
    illustration: { type: String, required: true },
    description: { type: String, required: true },
    lore:{type:String,required:true},
    class: { type: String, required: true, enum: ["Guardian", "Breaker", "Predator", "Nimble"] },
    element: { type: [String], required: true, enum: ["Light", "Shadow", "Fire", "Water", "Earth", "Metal", "Air","Lightning","Ice","Nature"] },// Element type of the pet
    weaknesses: [{ type: String, enum: ["Light", "Shadow", "Fire", "Water", "Earth", "Metal", "Air","Lightning","Ice","Nature"] }, ],// List of weaknesses against other elements
    strengths: [{ type: String, enum: ["Light", "Shadow", "Fire", "Water", "Earth", "Metal", "Air","Lightning","Ice","Nature"]  }]// List of strengths against other elements
  },
  {
    timestamps: true
  }
);

const PetLibrary = mongoose.model("PetLibrary", petLibrarySchema);

module.exports = PetLibrary;
