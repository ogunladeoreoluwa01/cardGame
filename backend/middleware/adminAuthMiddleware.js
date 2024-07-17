const jwt  = require("jsonwebtoken");
const User = require( "../models/user.model.js") ;

const adminGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      // Verify the token and extract the user ID
      const { id } = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and exclude the password field
      req.user = await User.findById(id).select("-password -oldPassword -notifications -__v");

      // Check if the user exists
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // Check if the user is either an admin or a super admin
      if (!req.user.isAdmin && !req.user.superAdmin) {
        return res
          .status(403)
          .json({ message: "Not authorized, user is not an admin" });
      }

      // Proceed to the next middleware
      next();
    } catch (error) {
      console.error(error);
      return res.status(440).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(440).json({ message: "Not authorized, no token" });
  }
};

module.exports = adminGuard;
