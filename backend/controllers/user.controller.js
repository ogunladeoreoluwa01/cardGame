const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../utils/cloudinaryConfig");
const crypto = require("crypto");
const mailer = require("../utils/sendMailConfig");

const generateJwt = (userId, expiresIn) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// userprofile action
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("-password -oldPassword -notifications -__v")
      .populate({
        path: 'userStats.achievements',
        model: 'Achievements'
      })
       .populate({
        path: 'pets.favPet',
        model: 'Pet'
      })
      .populate({
        path: 'pets.currentDeck',
        model: 'Pet'
      })
      .populate({
        path: 'notifications',
        model: 'Notifications'
      });

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with the provided credential does not exist." });
    }
    
    res.status(200).json({
      message: "User fetched successfully.",
      user: user
    });
  } catch (error) {
    console.error("Error fetching user:", error); // Log the error details
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getUsersByName = async (req, res) => {
  try {
    // Set up pagination parameters
    const limit = parseInt(req.query.limit) || 10; // Number of users per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const skip = (page - 1) * limit;
    let message = "";

    // Extract filters and sorting options from request body and query parameters
    const { username } = req.body;
    const { sortBy = 'score', sortOrder = 'desc' } = req.query;

    // Build the query object
    const query = { banned: false };
    if (username) {
      query.username = new RegExp(username, 'i'); // Use regex for case-insensitive search
    }

    // Set up sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    if (sortBy !== 'score') {
      sort.score = -1;
    }
    if (sortBy !== 'followers.length') {
      sort['followers.length'] = -1;
    }

    // Fetch the users with the specified criteria
    let users = await User.find(query)
      .select("-password -oldPassword -notifications -__v")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // If no users are found based on the query
    if (users.length === 0) {
      if (username) {
        message = "No users found with the specified username.";
      } else {
        message = "No users found.";
      }
    }

    // Fetch the total user count with the same criteria
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    // Organize the users
    const organizedUsers = users.reduce((acc, user) => {
      acc[user.username] = user;
      return acc;
    }, {});

    // Send the response
    res.status(200).json({
      currentPage: page,
      totalPages,
      totalUsers,
      users: organizedUsers,
      message: users.length === 0 ? message : undefined,
    });
  } catch (error) {
    console.error("Error during fetching users:", error); // Log the error details
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



const editUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { username, bio, email, fullName, gender, phoneNumber } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update user properties based on incoming request data
    if (username) user.username = username;
    if (email && email !== user.email) {
      user.email = email;
      user.isVerified = false; // Reset verification status if email is updated
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;

    }
    if (gender) user.profile.gender = gender;
    if (bio) user.profile.bio = bio;
    if (fullName) user.profile.fullName = fullName;

    await user.save();

    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error editing user profile:", error);
    error.statusCode = 500;
    next(error);
  }
};









module.exports ={
   getUserById,
   getUsersByName,
editUserProfile
}