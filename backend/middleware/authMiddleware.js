const jwt  = require("jsonwebtoken");
const User = require( "../models/user.model.js") ;
const authGuard = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id).select("-password -oldPassword -notifications -__v");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(440).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(440).json({ message: "Not authorized, no token" });
  }
};

module.exports = authGuard;
