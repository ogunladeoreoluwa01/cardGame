const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Arenas schema
const arenasSchema = new Schema(
  {
    name: { type: String, required: true }, // Name of the arena
    description: { type: String, default: "" }, // Description of the arena
    element: [{ type: [String], default: ""}], // Element associated with the arena
    imageUrl: { type: String, default: "" }, // URL to the image representing the arena
  },
  {
    timestamps: true // Automatically include createdAt and updatedAt fields
  }
);

// Compile the model
const Arenas = mongoose.model("Arenas", arenasSchema);

module.exports = Arenas;
