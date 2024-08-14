const User = require("../models/user.model.js");
const Pet = require("../models/pet.model.js")
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
        path: 'pets.currentDeck',
        populate: {
        path: 'petInfo',
        select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
      }
      });

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with the provided credential does not exist." });
    }
    
    res.status(200).json({
      message: "User fetched successfully.",
      userInfo: user
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






const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(410).json({ message: "Incorrect password." });
    }

    // Update pets to be system-owned
    for (const pet of user.pets) {
      const petData = await Pet.findById(pet);
      if (petData) {
        petData.isSystemOwned = true;
        await petData.save();
      }
    }

    // Delete user
    await user.deleteOne();

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "An error occurred while deleting the user." });
    next(error);
  }
};



const uploadUserAvatar = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imgFolder = `${user.username},${user._id},profile image`;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: imgFolder,
      crop: "scale",
      width: 250,
      quality: "auto",
      fetch_format: "auto",
    });

    if (!result) {
      return res.status(500).json({ message: "File upload failed" });
    }

    user.profile.avatar = result.secure_url || user.profileImage.profileImgUrl;


     await user.save();
    delete user.password;
    delete user.oldPassword;
    delete user.notifications;
    delete user.__v;
 

    res.status(200).json({
      message: "User avatar updated successfully",
      user: user ,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const userLeaderboard = async (req, res, next) => {
  try {
    // Extract limit and sort parameters from request query
    const { limit, sortParam } = req.query;
    const { userId } = req.params; // Extract userId from request parameters

    let sort; // Default sort by user level in descending order

    // Adjust sorting based on provided sortParam
    if (sortParam === "pets") {
      sort = { 'pets.allPets.length': -1, 'profile.level': -1 }; // Sort by the number of pets, then by user level
    } else if (sortParam === "duelwon") {
      sort = { 'userStats.duelsWon': -1, 'profile.level': -1 }; // Sort by duels won, then by user level
    } else if (sortParam === "rank") {
      sort = { 'userStats.Duelpoints': -1, 'profile.level': -1 }; // Sort by duel points, then by user level
    }  else if (sortParam === "riches") {
      sort = { 
        'profile.Aureus': -1, 
        'profile.Argentum': -1, 
        'profile.level': -1 
      }; // Sort by Aureus, then by Argentum, then by user level
    }
    else {
      sort = { 'profile.level': -1 }; // Default sort by user level
    }

    // Set leaderboard limit or default to 10 if not provided
    const leaderBoardLimit = limit ? parseInt(limit, 10) : 10;

    // Fetch all users and sort them based on the criteria
    const allUsers = await User.find()
      .sort(sort)
      .select("-password -oldPassword -notifications -__v");

    // Find the user's position in the sorted list
    const userIndex = allUsers.findIndex(user => user._id.equals(userId));
    const userPosition = userIndex + 1;
    const userInfo = userIndex !== -1 ? allUsers[userIndex] : null;

    // Paginate the results
    const leaderBoard = allUsers.slice(0, leaderBoardLimit);

    // Send successful response with leaderboard data and user position
    res.status(200).json({ 
      leaderBoard, 
      userPosition, 
      userInfo,
      message: "Leaderboard retrieved successfully" 
    });
  } catch (error) {
    console.error("Error retrieving leaderboard:", error);
    res.status(500).json({ message: "An error occurred while retrieving the leaderboard." });
    next(error);
  }
}

const userInventoryItems = async (req, res, next) => {
  try {
    // Extract userId from request parameters
    const userId = req.params.userId;
    // Extract filters and pagination parameters from request query
    const { itemType, effectType, sort, page = 1, limit = 10 } = req.query;

    // Find the user by ID and populate the inventory items
    const user = await User.findById(userId)
      .populate('inventory.itemId')
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Apply filters
    let items = user.inventory;

    if (itemType) {
      items = items.filter(item => item.itemId.type === itemType);
    }

    if (effectType) {
      items = items.filter(item => item.itemId.effectType === effectType);
    }

    // Apply sorting
    if (sort) {
      if (sort === 'quantity') {
        items.sort((a, b) => b.quantity - a.quantity);
      } else if (sort === 'effectType') {
        items.sort((a, b) => a.itemId.effectType.localeCompare(b.itemId.effectType));
      } // Add other sorting options as needed
    }

    // Paginate the results
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedItems = items.slice((page - 1) * limit, page * limit);

    // Send successful response with paginated items
    res.status(200).json({
      message: "Inventory items retrieved successfully",
      items: paginatedItems,
      pagination: {
        totalItems,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving inventory items:", error);
    res.status(500).json({ message: "An error occurred while retrieving inventory items." });
    next(error);
  }
};



const userInventoryPets = async (req, res, next) => {
  const userId = req.user.id;
  const { element, rarity, petClass, isLvl = "highest", petcategory = "all-pets" } = req.query;
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User with the provided credentials does not exist." });
    }

    let sort = { level: -1 };
    let query = {};

    if (isLvl === "lowest") {
      sort.level = 1;
    }
    
    // Add element condition to the query if provided
    if (element) {
      query['petInfo.element'] = { $in: [element] };
    }

    // Add pet class condition to the query if provided
    if (petClass) {
      query['petInfo.class'] = petClass;
    }

    // Add rarity condition to the query if provided
    if (rarity) {
      query.rarity = rarity;
    }

    // Handle different pet categories
    if (petcategory === "all-pets") {
      query['userProfile.userId'] = userId;
    } else if (petcategory === "current-deck") {

      const objectCurrentDeck = user.pets.currentDeck.map(id => ObjectId(id));
      query._id = { $in: objectCurrentDeck };
    } else if (petcategory === "available-pets") {
      const objectAvailableDeck = user.pets.availablePets.map(id => ObjectId(id));
      query._id = { $in: objectAvailableDeck };
    }

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Find all pets by userProfile.userId and populate the necessary fields
    const pets = await Pet.find(query)
      .populate({
        path: 'petInfo', // Populate the petInfo directly if it's a single reference
        select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get the total count of pets for pagination purposes
    const totalPets = await Pet.countDocuments(query);

    // Respond with the pets details and pagination info
    res.status(200).json({
      message: "Pets found successfully.",
      pets: pets,
      pagination: {
        totalItems: totalPets,
        totalPages: Math.ceil(totalPets / limit),
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    console.error("Error fetching pets details:", error);
    res.status(500).json({ message: "An error occurred while fetching pets details." });
    next(error);
  }
};
















module.exports ={
   getUserById,
   getUsersByName,
editUserProfile,
userLeaderboard,
userInventoryPets,
userInventoryItems
}