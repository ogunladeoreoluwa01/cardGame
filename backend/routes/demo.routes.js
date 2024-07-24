const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authMiddleware.js');
const {
   createArena
} = require('../controllers/arena.controller');
const {
   createPet
} = require('../controllers/pets.controller');
const {
      createDuel,
    joinDuel,
       closeDuelB4Ongoing
} = require('../controllers/duel.controller');

// auth routes
router.post('/arena', createArena);
router.post('/pet', createPet);
router.post('/create-duel',authGuard, createDuel);
router.post('/join-duel',authGuard,  joinDuel);
router.delete('/close-pending-duel',authGuard,     closeDuelB4Ongoing);

module.exports = router;
