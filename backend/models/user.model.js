const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema(
  {
    phoneNumber: { type: Number },
    username: { type: String, required: true, unique: true, index: true },
    playerRank: { type: String, enum: ["Wood", "Onyx", "Bronze", "Silver", "Gold", "Ruby", "Master", "Amethyst"], default: "Wood" },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, required: true, default: false },
    oldPassword: { type: [String], default: [] },
    isAdmin: { type: Boolean, default: false },
    superAdmin: { type: Boolean, default: false },
    profile: {
      gender: { type: String, default: "" },
      fullName: { type: String, default: "user" },
      bio: { type: String, default: "hello world" },
      avatar: { type: String, default: "" },
      coverImage: { type: String, default: "" },
      level: { type: Number, default: 1 },
      experience: { type: Number, default: 0 },
      xpNeededToNextLevel: { type: Number, default: 100 },
      Aureus: { type: Number, default: 10 },
      followers:[{ type: Schema.Types.ObjectId, ref: "User", default: "" }],
      Argentum: { type: Number, default: 500 }
    },
    userStats: {
      achievements: [{ type: Schema.Types.ObjectId, ref: "Achievements", default: [] }],
      Duelpoints: { type: Number, default: 0 },
      DuelPointsToNextLevel: { type: Number, default: 1000 },
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
      availablePets: [{ type: Schema.Types.ObjectId, ref: "Pet", default: [], index: true }],
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
      case "Wood":
        pointsNeeded = 0;
        break;
      case "Onyx":
        pointsNeeded = 1000;
        break;
      case "Bronze":
        pointsNeeded = 2000;
        break;
      case "Silver":
        pointsNeeded = 3000;
        break;
      case "Gold":
        pointsNeeded = 4000;
        break;
      case "Ruby":
        pointsNeeded = 5000;
        break;
      case "Master":
        pointsNeeded = 10000;
        break;
      case "Amethyst":
        pointsNeeded = 20000;
        break;
      default:
        pointsNeeded = 0;
    }

    let accumulatedPoints = this.userStats.Duelpoints;
    let newRank = this.playerRank;
    let rankChanged = false;

    // Determine the new rank based on accumulated points
    while (accumulatedPoints >= pointsNeeded) {
      rankChanged = true;
      switch (newRank) {
        case "Wood":
          newRank = "Onyx";
          pointsNeeded = 1000;
          break;
        case "Onyx":
          newRank = "Bronze";
          pointsNeeded = 2000;
          break;
        case "Bronze":
          newRank = "Silver";
          pointsNeeded = 3000;
          break;
        case "Silver":
          newRank = "Gold";
          pointsNeeded = 4000;
          break;
        case "Gold":
          newRank = "Ruby";
          pointsNeeded = 5000;
          break;
        case "Ruby":
          newRank = "Master";
          pointsNeeded = 10000;
          break;
        case "Master":
          newRank = "Amethyst";
          pointsNeeded = 20000;
          break;
        case "Amethyst":
          // If already at the highest rank, exit the loop
          pointsNeeded = Infinity;
          break;
        default:
          pointsNeeded = 0;
          break;
      }
    }

    // Update player rank and points to next level only if the rank has changed
    if (rankChanged) {
      this.playerRank = newRank;
      this.userStats.DuelPointsToNextLevel = pointsNeeded;
    }
  }
  next();
});


// Pre-save middleware to handle currency conversion
userSchema.pre("save", async function (next) {
  if (this.isModified("profile.Argentum")) {
    if (this.profile.Argentum >= 1000) {
      const aureusToAdd = Math.round(Math.floor(this.profile.Argentum / 1000));
      this.profile.Aureus += aureusToAdd;
      this.profile.Argentum = this.profile.Argentum % 1000;
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
