const mongoose = require("mongoose");
const PetLibrary = require("./petLibary.model");
const  User = require("./user.model.js")
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
      userId: { type: Schema.Types.ObjectId, ref: "User"},
      username: { type: String },
      coverImage: { type: String, default: "" },
      previousUsers:[{ type: Schema.Types.ObjectId, ref: "User", default: [], index: true }],
    },
    petInfo: { type: Schema.Types.ObjectId, ref: "PetLibrary", required: true,  },
    experience: { type: Number, default: 0 },
    xpNeededToNextLevel: { type: Number, default: 0 },
    rarity: { type: String, default: assignRandomRarity }, // Assign a random rarity on creation
    currentHealth: { type: Number, default: 100 },
    currentAttack: { type: Number, default: 10 },
    currentDefense: { type: Number, default: 10 },
    currentManaCost: { type: Number, default: 5 },
    currentCost:{type:Number},
    level: { type: Number, default: 1 }, // Adding level field to the schema
    isListed:{type:Boolean , default:false},
    listingNo:{type:String,default:""},
    listingPrice:{type:Number,default:0},
    isSystemOwned:{type:Boolean , default:false},
  },
  {
    timestamps: true // Automatically include createdAt and updatedAt fields
  }
);
   

petSchema.pre("save", async function (next) {
  

  // Skip the middleware if userProfile.userId exists
  if ( !this.userProfile.userId) {
    return next();
  }

  if (this.isSystemOwned) {
    

    try {
      const user = await User.findById(this.userId);

      if (!user) {
      
        throw new Error(`User not found: ${this.userId}`);
      } else {
        if (user.pets.favPet.toString() === this._id.toString()) {
          user.pets.favPet = "";
        }
        user.pets.currentDeck = user.pets.currentDeck.filter(petId => petId.toString() !== this._id.toString());
        user.pets.allPets = user.pets.allPets.filter(petId => petId.toString() !== this._id.toString());

        await user.save();
        this.previousUsers.push(this.userId);
        this.userId = "";
        this.username = "";
        this.coverImage = "";
      }
    } catch (error) {
      
      return next(error); // Properly pass the error to the next middleware
    }
  }
  next();
});


// Pre-save middleware to update stats based on level and rarity
petSchema.pre("save", async function (next) {


  // Find the pet species data in the library
  const petData = await PetLibrary.findById(this.petInfo);

  if (!petData) {
  
    throw new Error("Pet species not found in library");
  }

  const rarityMultiplier = getRarityMultiplier(this.rarity);


  // Define maximum values for level 1 pet
  const maxHealth = 1000;  // Maximum health for a level 1 pet
  const maxAttack = 400;   // Maximum attack for a level 1 pet
  const maxDefense = 300;  // Maximum defense for a level 1 pet
  const maxManaCost = 200; // Maximum mana cost for a level 1 pet

  // Wiggle room to extend the stats for rare pets
  const wiggleRoom = 500;

  // Calculate the pet's stats with constraints
  this.currentHealth = Math.min(
    Math.round(petData.baseHealth * this.level * rarityMultiplier),
    maxHealth + wiggleRoom
  );

  this.currentAttack = Math.min(
    Math.round(petData.baseAttack * this.level * rarityMultiplier),
    maxAttack + wiggleRoom
  );

  this.currentDefense = Math.min(
    Math.round(petData.baseDefense * this.level * rarityMultiplier),
    maxDefense + wiggleRoom
  );

  this.currentManaCost = Math.min(
    Math.round(petData.baseManaCost * this.level * rarityMultiplier),
    maxManaCost + wiggleRoom
  );

  // Cost Calculation Parameters
  const baseCost = petData.baseCost;  // Base cost of the pet
  const maxCostCap = 10000;  // Define the maximum cap for the cost

  // Calculate the variable part of the cost based on stats
  const variableCost = Math.round(
    (this.currentHealth + this.currentAttack + this.currentDefense + this.currentManaCost) *
    rarityMultiplier
  );

  // Calculate total cost and apply the max cost cap
  this.currentCost = Math.min(baseCost + variableCost, maxCostCap);



  next();
});

// Pre-save middleware to add experience and level up if needed
petSchema.pre("save", async function (next) {


  // Stop gaining experience if the pet is already at max level (100)
  if (this.level >= 100) {
   
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
 

  // Check if enough experience has been accumulated for a level up
  if (this.experience >= xpNeeded && this.level < 100) {
    this.level += 1;
    this.experience -= xpNeeded;
    
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
