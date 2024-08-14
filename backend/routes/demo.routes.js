const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authMiddleware.js');
const {
   createArena
} = require('../controllers/arena.controller');
const {
   createPet,
   getAllUserPets,
   addPetToMarketPlace,
    getAPetDetails,
    getUsersCurrentDeck ,
    editCurrentDeck
} = require('../controllers/pets.controller');
const {
      createDuel,
    joinDuel,
       closeDuelB4Ongoing
} = require('../controllers/duel.controller');
const {
   viewAllListings,
   getAListing,
   BuyAListing,
BuySystemListing 
} =require('../controllers/market.controller')


// auth routes
router.post('/arena', createArena);
router.post('/pet', createPet);
router.post('/add',addPetToMarketPlace)
router.post('/create-duel',authGuard, createDuel);
router.post('/buy-listing',authGuard, BuyAListing);
router.post('/buy-system-listing',authGuard, BuySystemListing);
router.post('/join-duel',authGuard,  joinDuel);
router.put('/edit-current-deck',authGuard,  editCurrentDeck);
router.get('/get-all-users-pets/:userId',authGuard,  getAllUserPets);
router.get('/get-users-current-deck/:userId',authGuard,  getUsersCurrentDeck);
router.get('/view-all-listing',authGuard, viewAllListings);
router.get('/get-a-listing/:listingNo',authGuard, getAListing);
router.get('/get-pet/:petId',  getAPetDetails);
router.delete('/close-pending-duel',authGuard, closeDuelB4Ongoing);

module.exports = router;
