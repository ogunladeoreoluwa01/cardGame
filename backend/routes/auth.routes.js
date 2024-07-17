const express = require('express');
const router = express.Router();

const authGuard = require('../middleware/authMiddleware.js');
const checkBanStatusLogin = require('../middleware/checkBanStatusLogin.js');
const checkBanStatusToken = require('../middleware/checkBanStatusToken.js');
const checkDisableStatusLogin = require('../middleware/checkDisableStatusLogin.js');
const disableStatusCheckToken = require('../middleware/disableStatusCheckToken.js');
const adminGuard = require("../middleware/adminAuthMiddleware");
const superAdminGuard = require("../middleware/superAdminAuthMiddleware");
const checkBanStatus = require("../middleware/checkBanStatusToken");
const checkDisabledStatus = require("../middleware/disableStatusCheckToken");
const {
    registerUser,
    loginUser,
    refreshToken,
   createOtpCode,
} = require('../controllers/auth.controller.js');

// auth routes
router.post('/register', registerUser);
router.post('/refresh-token', refreshToken);
router.post('/login',checkBanStatusLogin,checkDisableStatusLogin, loginUser);
router.post('/create-otp-code',authGuard,checkBanStatus,checkDisabledStatus, createOtpCode);

module.exports = router;

