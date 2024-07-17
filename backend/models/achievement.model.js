const mongoose = require("mongoose");
const { Schema } = mongoose;

const achievementSchema = new Schema(
  {
    achievementName: { type: string, default: "" },
    achievementEmblem: { type: string, default: "" },
    achievementDescription:
      { type: string, default: "" },
  },
  {
    timestamps: true, 
  }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

module.exports = Achievement;
