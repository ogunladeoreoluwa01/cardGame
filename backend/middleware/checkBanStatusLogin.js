
const jwt  = require("jsonwebtoken");
const User = require( "../models/user.model.js") ;

const checkBanStatusLogin = async (req, res, next) => {
  try {
    const { userInfo } = req.body;

    // Check if req.user is set by your authentication middleware
    if (!userInfo) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username: userInfo }, { email: userInfo }],
    });

    // If user not found, return appropriate response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is banned, handle the ban status
    if (user.banned && user.banExpiration && new Date() > user.banExpiration) {
      user.banned = false;
      user.banReason = null;
      user.banExpiration = null;
      await user.save();
    }

    if ( user.banned) {
      let banMessage = "You are banned.";
      if (user.banExpiration) {
        const banDuration = user.banExpiration - new Date();
        if (banDuration > 0) {
          // Convert ban duration from milliseconds to human-readable format
          const durationInMinutes = Math.floor(
            (banDuration / (1000 * 60)) % 60
          );
          const durationInHours = Math.floor(
            (banDuration / (1000 * 60 * 60)) % 24
          );
          const durationInDays = Math.floor(
            banDuration / (1000 * 60 * 60 * 24)
          );

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

      return res
        .status(451)
        .json({
          message: banMessage,
          banDuration: user.banExpiration,
          banReason: user.banReason,
        });
    }

    // If the user is not banned, continue to the next middleware/controller
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkBanStatusLogin;
