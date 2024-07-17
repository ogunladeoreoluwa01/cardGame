const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Pet schema fields directly within the Duel schema
const petSchema = new Schema( {
    userProfile: {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true, },
      username: { type: String, required: true },
      coverImage: { type: String, default: "" }
    },
    petInfo: {    
      name: { type: String, required: true, },
      illustration: { type: String, required: true },
      description: { type: String, required: true },
      class: { type: String, required: true, enum: ["Guardian", "Breaker", "Predator", "Nimble"] },
      element: { type: [String], required: true, enum: ["Light", "Dark", "Fire", "Water", "Earth", "Metal", "Air","Lightning","Ice","Nature"] },// Element type of the pet
      weaknesses: [{ type: String, enum: ["Light", "Shadow", "Fire", "Water", "Earth", "Metal", "Air","Lightning","Ice","Nature"] }, ],// List of weaknesses against other elements
      strengths: [{ type: String, enum: ["Light", "Shadow", "Fire", "Water", "Earth", "Metal", "Air","Lightning","Ice","Nature"]  }]// List of strengths against other elements },
    },
    experience: { type: Number, default: 0 },
    xpNeededToNextLevel: { type: Number, default: 0 },
    rarity: { type: String,  }, // Assign a random rarity on creation
    currentHealth: { type: Number, default: 100 },
    currentAttack: { type: Number, default: 10 },
    currentDefense: { type: Number, default: 10 },
    currentManaCost: { type: Number, default: 5 },
    level: { type: Number, default: 1 }, // Adding level field to the schema
  }, { _id: false }); 
// Disable _id for embedded schema

// Define the Duel schema with embedded Pet data
const duelSchema = new Schema(
  {
    arena: { type: Schema.Types.ObjectId, ref: "Arenas", required: true },
    players: {
      player1: {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true, },
        username: { type: String, required: true },
        playerStatus: { type: String, enum: ['disconnected', 'pending', 'connected', 'reconnecting'] },
        profileIMG: { type: String, required: true },
        currentDeck: [petSchema], // Embed Pet schema for currentDeck
        discardPile: [petSchema], // Embed Pet schema for discardPile
        manaPool: { type: Number, default: 30 },
        health: { type: Number, default: 30 },
        rank: { type: String },
        activePet: petSchema, // Embed Pet schema for activePet
        statusEffects: {

          type: { type: String, enum: ['dazzle', 'fear', 'burn', 'soak', 'petrify', 'corrode', 'disorient', 'shock', 'freeze', 'poison',""] },
          duration: { type: Number }, // turns remaining
          value: { type: Number } // effect value, e.g., damage per turn, defense reduction percentage
        },
        isDefending: { type: Boolean, default: false}
      },
      player2: {
        userId: { type: Schema.Types.ObjectId, ref: "User",  },
        username: { type: String },
        playerStatus: { type: String, enum: ['disconnected', 'pending', 'connected', 'reconnecting'] },
        profileIMG: { type: String},
        currentDeck: [petSchema], // Embed Pet schema for currentDeck
        discardPile: [petSchema], // Embed Pet schema for discardPile
        manaPool: { type: Number, default: 30 },
        health: { type: Number, default: 30 },
        rank: { type: String },
        activePet: petSchema, // Embed Pet schema for activePet
        statusEffects: {
          type: { type: String, enum: ['dazzle', 'fear', 'burn', 'soak', 'petrify', 'corrode', 'disorient', 'shock', 'freeze', 'poison',""] },
          duration: { type: Number }, // turns remaining
          value: { type: Number } // effect value, e.g., damage per turn, defense reduction percentage
        },
        isDefending: { type: Boolean, default: false}
      }
    },
    duelJoinKey: { type: String, default: "" },
    currentTurn: { type: String, enum: ["player1", "player2"], default: "player1" },
    rankRange: { type: [String], default: [], index: true },
    rewards: {
      experience: { type: Number, default: 0 },
      currency: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true, index: true },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
    loser: { type: Schema.Types.ObjectId, ref: "User" },
    result: { type: String, enum: ["player1", "player2", "draw", "noWinner"], default: "noWinner" },
    status: { type: String, enum: ["pending", "ongoing", "completed"], default: "pending", index: true },
    endDate: { type: Date },
    isOpen: { type: Boolean, default: true, index: true },
    isPrivate: { type: Boolean, default: false, index: true },
    turnLimit: { type: Number, default: 50 },
    noOfTurns: { type: Number, default: 0 },
    deckSize: { type: Number, default: 10 }
  },
  {
    timestamps: true
  }
);

const Duel = mongoose.model("Duel", duelSchema);

module.exports = Duel;
