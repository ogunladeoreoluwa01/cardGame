const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema(
  {
    phoneNumber: { type: Number },
    username: { type: String, required: true, unique: true, index: true },
    playerRank: { type: String, enum: ["Unranked", "Rustic", "Exalted", "Mythic", "Ethereal", "Arcane", "Champion", "Legend"], default: "Unranked" },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    oldPassword: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false },
    superAdmin: { type: Boolean, default: false },
    profile: {
      gender: { type: String, default: "" },
      fullName: { type: String, default: "" },
      bio: { type: String, default: "" },
      avatar: { type: String, default: "" },
      coverImage: { type: String, default: "" },
      level: { type: Number, default: 1 },
      experience: { type: Number, default: 0 },
      xpNeededToNextLevel: { type: Number, default: 100 },
      Aureus: { type: Number, default: 2 },
      Argentum: { type: Number, default: 30 }
    },
    userStats: {
      achievements: [{ type: Schema.Types.ObjectId, ref: "Achievements", default: [] }],
      seasonsPlayed: { type: [String], default: [] },
      currentSeason: { type: Object, default: {} },
      Duelpoints: { type: Number, default: 0 },
      DuelPointsToNextLevel: { type: Number, default: 0 },
      duelsWoninCurrentSeason: { type: Number, default: 0 },
      duelsLostinCurrentSeason: { type: Number, default: 0 },
      duelsWon: { type: Number, default: 0 },
      duelsLost: { type: Number, default: 0 },
    },
    inventory: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ],
    pets: {
      favPet: { type: Schema.Types.ObjectId, ref: "Pet", index: true },
      allPets: [{ type: Schema.Types.ObjectId, ref: "Pet", default: [], index: true }],
      currentDeck: [{ type: Schema.Types.ObjectId, ref: "Pet", default: [], index: true }],
    },
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notifications", default: [], index: true }],
    banned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
    banExpiration: { type: Date, default: null },
    disable: { type: Boolean, default: false },
    disableReason: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, parseInt(process.env.SALT, 10));
      this.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to update experience and level if needed
userSchema.pre("save", async function (next) {
  if (this.isModified("profile.experience")) {
    let xpNeeded;
    if (this.profile.level <= 20) {
      xpNeeded = this.profile.level * 200;
    } else if (this.profile.level <= 40) {
      xpNeeded = this.profile.level * 400;
    } else if (this.profile.level <= 60) {
      xpNeeded = this.profile.level * 600;
    } else if (this.profile.level <= 80) {
      xpNeeded = this.profile.level * 800;
    } else {
      xpNeeded = this.profile.level * 1000;
    }

    this.profile.xpNeededToNextLevel = xpNeeded;

    while (this.profile.experience >= xpNeeded && this.profile.level < 200) {
      this.profile.level += 1;
      this.profile.experience -= xpNeeded;

      if (this.profile.level <= 20) {
        xpNeeded = this.profile.level * 200;
      } else if (this.profile.level <= 40) {
        xpNeeded = this.profile.level * 400;
      } else if (this.profile.level <= 60) {
        xpNeeded = this.profile.level * 600;
      } else if (this.profile.level <= 80) {
        xpNeeded = this.profile.level * 800;
      } else {
        xpNeeded = this.profile.level * 1000;
      }
      this.profile.xpNeededToNextLevel = xpNeeded;
    }

    if (this.profile.level > 200) {
      this.profile.level = 200;
    }
  }
  next();
});

// Pre-save middleware to update DuelPoints
userSchema.pre("save", async function (next) {
  if (this.isModified("userStats.Duelpoints")) {
    let pointsNeeded;
    switch (this.playerRank) {
      case "unranked":
        pointsNeeded = 0;
        break;
      case "Rustic":
        pointsNeeded = 1000;
        break;
      case "Exalted":
        pointsNeeded = 2000;
        break;
      case "Mythic":
        pointsNeeded = 3000;
        break;
      case "Ethereal":
        pointsNeeded = 4000;
        break;
      case "Arcane":
        pointsNeeded = 5000;
        break;
      case "Champion":
        pointsNeeded = 10000;
        break;
      case "Legend":
        pointsNeeded = 20000;
        break;
      default:
        pointsNeeded = 0;
    }

    this.userStats.DuelPointsToNextLevel = pointsNeeded;

    while (this.userStats.Duelpoints >= pointsNeeded) {
      this.userStats.Duelpoints -= pointsNeeded;
      switch (this.playerRank) {
        case "unranked":
          this.playerRank = "Rustic";
          break;
        case "Rustic":
          this.playerRank = "Exalted";
          break;
        case "Exalted":
          this.playerRank = "Mythic";
          break;
        case "Mythic":
          this.playerRank = "Ethereal";
          break;
        case "Ethereal":
          this.playerRank = "Arcane";
          break;
        case "Arcane":
          this.playerRank = "Champion";
          break;
        case "Champion":
          this.playerRank = "Legend";
          break;
        case "Legend":
          break;
      }
      switch (this.playerRank) {
        case "unranked":
          pointsNeeded = 0;
          break;
        case "Rustic":
          pointsNeeded = 1000;
          break;
        case "Exalted":
          pointsNeeded = 2000;
          break;
        case "Mythic":
          pointsNeeded = 3000;
          break;
        case "Ethereal":
          pointsNeeded = 4000;
          break;
        case "Arcane":
          pointsNeeded = 5000;
          break;
        case "Champion":
          pointsNeeded = 10000;
          break;
        case "Legend":
          pointsNeeded = 20000;
          break;
        default:
          pointsNeeded = 0;
      }
      this.userStats.DuelPointsToNextLevel = pointsNeeded;
    }
  }
  next();
});

// Pre-save middleware to handle currency conversion
userSchema.pre("save", async function (next) {
  if (this.isModified("profile.Argentum")) {
    if (this.profile.Argentum >= 100) {
      const aureusToAdd = Math.floor(this.profile.Argentum / 100);
      this.profile.Aureus += aureusToAdd;
      this.profile.Argentum = this.profile.Argentum % 100;
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
