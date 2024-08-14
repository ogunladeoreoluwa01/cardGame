const express = require("express");
const router = express.Router();
const authGuard = require("../middleware/authMiddleware");
const adminGuard = require("../middleware/adminAuthMiddleware");
const superAdminGuard = require("../middleware/superAdminAuthMiddleware");
const checkBanStatus = require("../middleware/checkBanStatusToken");
const checkDisabledStatus = require("../middleware/disableStatusCheckToken");


const upload = require("../middleware/upload");
const {
getUserById,
getUsersByName,
editUserProfile,
userLeaderboard

} = require('../controllers/user.controller.js');

// userRoutes
router.get('/user-by-id/:userId', getUserById);
router.get('/user-leader-board/:userId', userLeaderboard);
router.get('/users', getUsersByName);
router.put('/edit-profile',authGuard,checkBanStatus,checkDisabledStatus, editUserProfile);


module.exports = router;
