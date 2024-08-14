
const User = require("../models/user.model");
const Duel = require("../models/duel.model.js")
const Pets = require("../models/pet.model.js")
const PetsLibary = require("../models/petLibary.model.js")
const Market = require("../models/market.model.js")
const Item = required("../models/items.model.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP =require("../models/otp.model")
const crypto =require("crypto")
const mailer = require("../utils/sendMailConfig");




const createListing = async (req, res, next) => {  
  try {
    const userId = req.user._id;
    const { itemId, isPet, price, sideNote, isPrivate } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Cannot make a listing if not verified." });
    }

    const listingNo = generateUniqueCode(userId);
    let sideText = sideNote || "";

    if (isPet) {
      // Check if pet is already listed
      const isListed = await Market.findOne({ listingCategory: 'pet', listingInfo: itemId });
      if (isListed) {
        return res.status(403).json({ message: "Cannot make a listing of an already listed pet." });
      }

      const pet = await Pet.findById(itemId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    pet.isListed = true

    await pet.save()

    const listingprice =  price || pet.currentCost;
      
    const petListingNo = `P-${listingNo}`;

      const newMarketEntry = new Market({
        sellerId: userId,
        listingNumber: petListingNo,
        listingCategory: 'pet',
        listingInfo: itemId,
        priceInSilver: listingprice,
        sideNote: sideText,
        isPrivate:isPrivate
      });

      await newMarketEntry.save();
      res.status(201).json({ message: `Pet listed successfully. Listing number: ${petListingNo}.`, listingNo: petListingNo });
    } else {
      // Check if item is already listed
      const isItem = await Item.findById({ itemId });
      if (isItem) {
        return res.status(403).json({ message: "item not found." });
      }

      const Item = user.inventory.find(item => item.itemId.toString() ===itemId.toString())

       if (!Item) {
      return res.status(404).json({ message: "cannot make a listin of a not owned item not found." });
    }

    if(!Item.quantity){
         return res.status(404).json({ message: "you do not have enough items in you inventory to sell  found." });
    }

    Item.quantity --


    await user.save()


      const itemListingNo = `I-${listingNo}`;
      const listingPrice = price || isItem.value


      const newMarketEntry = new Market({
        sellerId: userId,
        listingNumber: itemListingNo,
        listingCategory: 'item',
        listingInfo: itemId,
        priceInSilver: listingPrice,
        sideNote: sideText,
        isPrivate:isPrivate
      });

      await newMarketEntry.save();
      res.status(201).json({ message: `Item listed successfully. Listing number: ${itemListingNo}.`, listingNo: itemListingNo });
    }
  } catch (error) {
    console.error("Error making listing:", error);
    res.status(500).json({ message: "An error occurred while making the listing." });
    next(error);
  }
};