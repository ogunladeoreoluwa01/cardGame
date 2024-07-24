const mongoose = require("mongoose");
const PetLibrary = require("./petLibary.model");
const { Schema } = mongoose;

// Function to determine rarity multiplier based on rarity
const getRarityMultiplier = (rarity) => {
  switch (rarity) {
    case "Rustic":
      return 1;
    case "Arcane":
      return 1.2;
    case "Mythic":
      return 1.4;
    case "Exalted":
      return 1.6;
    case "Ethereal":
      return 1.8;
    default:
      return 1;
  }
};

// Function to assign a random rarity to a pet
const assignRandomRarity = () => {
  const rand = Math.random();
  if (rand < 0.05) return "Ethereal";     // 5% chance
  if (rand < 0.20) return "Exalted";      // 15% chance
  if (rand < 0.40) return "Mythic";       // 20% chance
  if (rand < 0.60) return "Arcane";       // 20% chance
  return "Rustic";                        // 40% chance
};

// Define the Pet schema
const petSchema = new Schema(
  {
    userProfile: {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true, },
      username: { type: String, required: true },
      coverImage: { type: String, default: "" }
    },
    petInfo: { type: Schema.Types.ObjectId, ref: "PetLibrary", required: true,  },
    experience: { type: Number, default: 0 },
    xpNeededToNextLevel: { type: Number, default: 0 },
    rarity: { type: String, default: assignRandomRarity }, // Assign a random rarity on creation
    currentHealth: { type: Number, default: 100 },
    currentAttack: { type: Number, default: 10 },
    currentDefense: { type: Number, default: 10 },
    currentManaCost: { type: Number, default: 5 },
    level: { type: Number, default: 1 }, // Adding level field to the schema
  },
  {
    timestamps: true // Automatically include createdAt and updatedAt fields
  }
);

// Pre-save middleware to update stats based on level and rarity
petSchema.pre("save", async function (next) {
  console.log("Pre-save hook triggered for pet:", this._id);

  const petData = await PetLibrary.findById(this.petInfo);

  if (!petData) {
    console.error("Pet species not found in library:", this.petInfo);
    throw new Error("Pet species not found in library");
  }

  const rarityMultiplier = getRarityMultiplier(this.rarity);
  console.log("Rarity multiplier:", rarityMultiplier);

  // Update pet's stats based on base stats, level, and rarity multiplier
  this.currentHealth =Math.round(petData.baseHealth * this.level * rarityMultiplier) ;
  this.currentAttack =Math.round(petData.baseAttack * this.level * rarityMultiplier);
  this.currentDefense =Math.round(petData.baseDefense * this.level * rarityMultiplier);
  this.currentManaCost =Math.round(petData.baseManaCost * this.level * rarityMultiplier);

  console.log("Updated stats - Health:", this.currentHealth, "Attack:", this.currentAttack, "Defense:", this.currentDefense, "Mana Cost:", this.currentManaCost);

  next();
});

// Pre-save middleware to add experience and level up if needed
petSchema.pre("save", async function (next) {
  console.log("Pre-save hook for adding experience triggered for pet:", this._id);

  // Stop gaining experience if the pet is already at max level (100)
  if (this.level >= 100) {
    console.log("Pet is already at max level (100). No XP added.");
    next();
    return;
  }

  // Determine the experience needed based on current level
  let xpNeeded;
  if (this.level <= 20) {
    xpNeeded = this.level * 100;
  } else if (this.level <= 40) {
    xpNeeded = this.level * 200;
  } else if (this.level <= 60) {
    xpNeeded = this.level * 300;
  } else if (this.level <= 80) {
    xpNeeded = this.level * 400;
  } else {
    xpNeeded = this.level * 500;
  }

  // Set xpNeededToNextLevel for the current level
  this.xpNeededToNextLevel = xpNeeded;
  console.log("XP needed for next level:", this.xpNeededToNextLevel);

  // Check if enough experience has been accumulated for a level up
  if (this.experience >= xpNeeded && this.level < 100) {
    this.level += 1;
    this.experience -= xpNeeded;
    console.log("Pet leveled up to level:", this.level);
    await this.updateStats();
  }

  // Ensure level does not exceed the maximum level of 100
  if (this.level > 100) {
    this.level = 100;
  }

  next();
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
