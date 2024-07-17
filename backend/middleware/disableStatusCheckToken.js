const jwt  = require("jsonwebtoken");
const User = require( "../models/user.model.js") ;

const disableStatusCheckToken = async (req, res, next) => {
  try {
    // Check if req.user is set by your authentication middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user._id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.disable) {
      let disableMessage = "you have disabled your account your .";

      if (user.disableReason) {
        disableMessage += ` Reason: ${user.disableReason}`;
      }

      return res.status(450).json({ message: disableMessage });
    }

    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = disableStatusCheckToken;
