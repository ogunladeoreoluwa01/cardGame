const jwt  = require("jsonwebtoken");
const User = require( "../models/user.model.js") ;

const checkBanStatusToken = async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming `req.user` is set by your authentication middleware
    let user = await User.findById(userId);
    

    
if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (user.banned && user.banExpiration && new Date() > user.banExpiration) {
      user.banned = false;
      user.banReason = null;
      user.banExpiration = null;
      await user.save();
    }

    if (user.banned) {
      let banMessage = "You are banned.";
      if (user.banExpiration) {
        const banDuration = user.banExpiration - new Date();
        if (banDuration > 0) {
          // Convert ban duration from milliseconds to human-readable format
          const durationInMinutes = Math.floor((banDuration / (1000 * 60)) % 60);
          const durationInHours = Math.floor((banDuration / (1000 * 60 * 60)) % 24);
          const durationInDays = Math.floor(banDuration / (1000 * 60 * 60 * 24));

          banMessage += ` Ban duration: `;
          if (durationInDays > 0) {
            banMessage += `${durationInDays} day(s), `;
          }
          if (durationInHours > 0) {
            banMessage += `${durationInHours} hour(s), `;
          }
          if (durationInMinutes > 0) {
            banMessage += `${durationInMinutes} minute(s)`;
          }
        } else {
          banMessage += " Ban duration: Indefinite";
        }
      }

      if (user.banReason) {
        banMessage += `. Reason: ${user.banReason}`;
      }

      return res.status(451).json({
        message: banMessage,
        username: user.username,
        banDuration: user.banExpiration,
        banReason: user.banReason,
      });
    }

    next();
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

module.exports = checkBanStatusToken;
