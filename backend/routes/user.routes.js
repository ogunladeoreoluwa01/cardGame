const express = require("express");
const router = express.Router();
const authGuard = require("../middleware/authMiddleware");
const adminGuard = require("../middleware/adminAuthMiddleware");
const superAdminGuard = require("../middleware/superAdminAuthMiddleware");
const checkBanStatus = require("../middleware/checkBanStatus");
const checkDisabledStatus = require("../middleware/softDeleteStatus");


const upload = require("../middleware/upload");
const {
getUserById,
getUsersByName,
editUserProfile,

} = require('../controllers/user.controller.js');

// userRoutes
router.get('/user/:userId', getUserById);
router.get('/users', getUsersByName);
router.put('/edit-profile',authGuard,checkBanStatus,checkDisabledStatus, editUserProfile);


module.exports = router;
