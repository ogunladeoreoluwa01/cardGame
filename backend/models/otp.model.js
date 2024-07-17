const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiringAt: {
    type: Date,
    required: true,
  },
});

// Pre-save middleware to hash the otpCode
otpSchema.pre("save", async function (next) {
  if (this.isModified("otpCode")) {
    try {
      const hashedOtpCode = await bcrypt.hash(this.otpCode, parseInt(process.env.SALT, 10));
      this.otpCode = hashedOtpCode;
      return next();
    } catch (error) {
      return next(error);
    }
  }
  return next();
});

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
