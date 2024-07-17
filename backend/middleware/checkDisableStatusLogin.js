
const jwt  = require("jsonwebtoken");
const User = require( "../models/user.model.js") ;

const checkDisableStatusLogin = async (req, res, next) => {
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

    // Check if the user account is soft deleted
    if (user.disable) {
      let disableMessage = "Your account has been disable";

      if (user.disableReason) {
        disableMessage += `. Reason: ${user.disableReason}`;
      }

      return res
        .status(450)
        .json({ message: disableMessage});
    }

    // If the user is not soft deleted, continue to the next middleware/controller
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkDisableStatusLogin;
