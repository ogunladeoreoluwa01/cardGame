const User = require("../models/user.model.js")
const Market = require("../models/market.model.js")
const Pet = require("../models/pet.model.js")
const Item = require("../models/items.model.js")
const crypto =require("crypto")




const generateUniqueCode = (userId) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let code = '';
  // Generate random bytes and map them to characters
  for (let i = 0; i < codeLength; i++) {
    const randomByte = crypto.randomBytes(1)[0];
    const characterIndex = randomByte % characters.length;
    code += characters.charAt(characterIndex);
  }
  // Create a hash of the userId and random code
  const hash = crypto.createHash('sha256').update(userId + code).digest('hex');
  const uniquePart = hash.slice(0, 4).toUpperCase(); // Take the first 6 characters for uniqueness

  return `${code.slice(0, 4)}${uniquePart}`;
};


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
      const isListed = await Market.findOne({ listingCategory: 'pet', petId: itemId });
      if (isListed) {
        return res.status(403).json({ message: "Cannot make a listing of an already listed pet." });
      }

      const pet = await Pet.findById(itemId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    pet.isListed = true



    const listingprice =  price || pet.currentCost;
    
    const petListingNo = `P-${listingNo}`;
pet.listingNo=petListingNo
pet.listingPrice= listingprice


    await pet.save()
      const newMarketEntry = new Market({
        sellerId: userId,
        listingNumber: petListingNo,
        listingCategory: 'pet',
        petId: itemId,
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
        itemId: itemId,
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



const viewAllListings = async (req, res, next) => {
  try {
    // Extract parameters from request
    const userId = req.user._id;
    const category = req.query.category || "pet";
    const itemname = req.query.itemname
    const element = req.query.element;
    const priceFilter = req.query.priceFilter || "low"; // low or high
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const dateFilter = req.query.dateFilter || "low"; // low or high
    const petClass =req.query.petClass;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Initialize query object for MongoDB
    let query = { isPrivate: false, isSold: false };
    let sort = {};
    let match = {};

   

    // Add price range filter if specified
    if (minPrice || maxPrice) {
      query.priceInSilver = {};
      if (minPrice) query.priceInSilver.$gte = parseFloat(minPrice);
      if (maxPrice) query.priceInSilver.$lte = parseFloat(maxPrice);
    }


    // Add category filter if specified
    if (category === "pet") {
      query.listingCategory = 'pet';
      if (element) {
        match.element = { $elemMatch: { $eq: element } };
      }
        if (petClass) {
        match.class = { $in: petClass }; 
      }
      
    if(itemname){
      match.name = { $regex: itemname, $options: 'i' }
    }
    } else if (category === "item") {
      query.listingCategory = 'item';
    }

    // Determine sorting based on the priceFilter
    if (priceFilter === 'low') {
      sort.priceInSilver = 1; // Ascending order (low to high)
    } else if (priceFilter === 'high') {
      sort.priceInSilver = -1; // Descending order (high to low)
    }

    // Determine sorting based on the dateFilter
    if (dateFilter === 'low') {
      sort.createdAt = 1; // Ascending order (old to new)
    } else if (dateFilter === 'high') {
      sort.createdAt = -1; // Descending order (new to old)
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    

    // Find listings based on the query and sorting
    const listings = await Market.find(query)
      .sort(sort) // Apply sorting
      .populate({
        path: 'petId',
        populate: {
          path: 'petInfo',
          select: '-baseHealth -baseAttack -baseDefense -baseManaCost',
          match: match
        }
      })
      .populate({
        path: 'itemId',
      })
  

      

    if (!listings || listings.length === 0) {
      return res.status(404).json({ message: 'No listings found' });
    }

    const filteredlistings = listings.filter(card => card.petId.petInfo !== null);

    const paginatedListings =filteredlistings.slice(skip, skip + limit)
    // Count total listings for pagination
    const totalListings = await Market.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalListings / limit);

    // Respond with the listings details and pagination info
    res.status(200).json({
      message: "Listings found successfully.",
      listing:paginatedListings,
      pagination: {
        totalListings,
        totalPages,
        currentPage: page,
      }
    });

  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "An error occurred while fetching the listings." });
    next(error);
  }
};




const getAListing = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { listingNo } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the listing by listingNumber and populate the appropriate fields
    const listing = await Market.findOne({ listingNumber:listingNo })
      .populate({
          path: 'pet',
            populate: {
        path: 'petInfo',
        select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
      },
          match: { $expr: { $eq: ['$listingCategory', 'pet'] } }
        })
      .populate({
        path: 'item',
        match: { $expr: { $eq: ['$listingCategory', 'item'] } }
      });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // Respond with the listing details
    res.status(200).json({
      message: "Listing found successfully.",
      listing: listing,
    });

  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ message: "An error occurred while fetching the listing." });
    next(error);
  }
};

const UpdateAListing = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { listingNo, newPrice, newSideNote, newPrivate } = req.body;

    // Validate inputs
    if (!listingNo) {
      return res.status(400).json({ message: "Listing number is require." });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the listing by listingNumber and populate the appropriate fields
    const listing = await Market.findOne({ listingNumber: listingNo })


    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // Check if the user is the seller
    const isSeller = userId.toString() === listing.sellerId.toString();
    if (!isSeller) {
      return res.status(403).json({ message: "Cannot edit another person's listing." });
    }

    // Update listing details
    if (newPrice !== undefined) {
      // Validate price
      if (typeof newPrice !== 'number' || newPrice < 0) {
        return res.status(400).json({ message: "Invalid price value." });
      }
      listing.priceInSilver = newPrice;
    }

    if (newSideNote !== undefined) {
      listing.sideNote = newSideNote;
    }

    if (newPrivate !== undefined) {
      // Validate private field
      if (typeof newPrivate !== 'boolean') {
        return res.status(400).json({ message: "Invalid private flag value." });
      }
      listing.isPrivate = newPrivate;
    }

    if(listing.listingCategory ===`pet`){

    const pet = await Pet.findById(listing.petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found." });
    }
 if (newPrice !== undefined) {
      // Validate price
      if (typeof newPrice !== 'number' || newPrice < 0) {
        return res.status(400).json({ message: "Invalid price value." });
      }
      pet.listingPrice= newPrice
    }
    
    await pet.save()
    }

    await listing.save();

    // Respond with the updated listing details
    res.status(200).json({
      message: "Listing updated successfully.",
      listing: listing,
    });

  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: "An error occurred while updating the listing." });
    next(error);
  }
};

const BuyAListing = async (req, res, next) => {
  try {
    const buyerId = req.user._id;
    const { listingNo } = req.body;

    // Validate inputs
    if (!listingNo) {
      return res.status(400).json({ message: "Listing number is require." });
    }

    // Find the listing by listingNumber and populate the appropriate fields
    const listing = await Market.findOne({ listingNumber: listingNo })
      .populate({
        path: 'pet',
        populate: {
          path: 'petInfo',
          select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
        },
        match: { $expr: { $eq: ['$listingCategory', 'pet'] } }
      })
      .populate({
        path: 'item',
        match: { $expr: { $eq: ['$listingCategory', 'item'] } }
      });

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if(listing.buyerId){
        return res.status(400).json({ message: "Listing already has a buyer." });
    }

    // Find the buyer by ID
    const buyer = await User.findById(buyerId);

    // Check if buyer exists
    if (!buyer) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the seller by ID
    const seller = await User.findById(listing.sellerId);

    // Check if seller exists
    if (!seller) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is the seller
    if (buyerId.toString() === listing.sellerId.toString()) {
      return res.status(403).json({ message: "Seller cannot buy their own listing." });
    }

    // Calculate the buyer's total currency in silver
    const buyerTotalSilver = buyer.profile.Argentum + (buyer.profile.Aureus * 100);

    // Check if user has enough silver to buy the listing
    if (buyerTotalSilver < listing.priceInSilver) {
      return res.status(403).json({ message: "Insufficient funds to buy this listing." });
    }

    // Calculate the new total silver for the buyer after the purchase
    const newBuyerTotalSilver = buyerTotalSilver - listing.priceInSilver;

    // Function to get the tax rate based on rank
    const getTaxRateByRank = (rank) => {
      switch (rank) {
        case "Ethereal":
          return 5.5;
        case "Exalted":
          return 5;
        case "Mythic":
          return 4;
        case "Arcane":
          return 3;
        case "Rustic":
          return 2;
        case "Unranked":
          return 1;
        default:
          return 1;
      }
    };

    // Calculate the seller's earnings post-tax
    const TaxedEarning = listing.priceInSilver - ((listing.priceInSilver / 100) * getTaxRateByRank(seller.playerRank));
    const sellersEarningPostTAX = TaxedEarning;

    // Handle pet listings
    if (listing.listingCategory === 'pet') {
      const pet = await Pet.findById(listing.petId);

      // Check if pet exists
      if (!pet) {
        return res.status(404).json({ message: "Pet not found." });
      }

      // Check if the pet has already been sold 
      if (pet.userProfile.previousUsers.includes(listing.sellerId)) {
        return res.status(404).json({ message: "Pet no longer belongs to this person; it might have been already bought." });
      }

      // check if buyer has owned the pet before if so removes the buyer from previously owned array
if (pet.userProfile.previousUsers.includes(buyerId)) {
  pet.userProfile.previousUsers = pet.userProfile.previousUsers.filter(id => id.toString() !== buyerId.toString());
}


      // Update pet ownership details
      pet.userProfile.previousUsers.push(listing.sellerId);
      pet.userProfile.userId = buyer._id;
      pet.userProfile.username = buyer.username;
      pet.userProfile.coverImage = buyer.profile.avatar;
      pet.isListed = false;
      pet.listingNo=""
      pet.listingPrice = 0
      await pet.save();
      listing.isSold = true
      await listing.save()
    } else {
      // Handle item listings
      const itemCheck = buyer.inventory.find(item => item.itemId.toString() === listing.item._id.toString());

      if (!itemCheck) {
        // If item is not in inventory, add it
        const item = await Item.findById(listing.item._id);
        if (!item) {
          return res.status(404).json({ message: "Item not found." });
        }

        buyer.inventory.push({
          itemId: item._id,
          quantity: 1,
        });
      } else {
        // If item is in inventory, update its quantity
        itemCheck.quantity++;
      }

      await buyer.save();
    }

    // Update buyer and seller currency after the transaction
    buyer.profile.Argentum = newBuyerTotalSilver;
    buyer.profile.Aureus = 0; // Reset Aureus as all were converted to Argentum
    seller.profile.Argentum += sellersEarningPostTAX;
listing.isSold = true
    await buyer.save();
    await seller.save();
    await listing.save(); 

    // Respond with success message
    res.status(200).json({
      message: "Listing bought successfully.",
    });

  } catch (error) {
    console.error("Error processing listing purchase:", error);
    res.status(500).json({ message: "An error occurred while processing the listing purchase." });
    next(error);
  }
};


const DeleteAListing = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { listingNo } = req.body;

    // Validate inputs
    if (!listingNo) {
      return res.status(400).json({ message: "Listing number is require." });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the listing by listingNumber and populate the appropriate fields
    const listing = await Market.findOne({ listingNumber: listingNo })
      .populate({
        path: 'pet',
        populate: {
          path: 'petInfo',
          select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
        },
        match: { $expr: { $eq: ['$listingCategory', 'pet'] } }
      })
      .populate({
        path: 'item',
        match: { $expr: { $eq: ['$listingCategory', 'item'] } }
      });

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // Check if the user is the seller
    if (userId.toString() !== listing.sellerId.toString()) {
      return res.status(403).json({ message: "Cannot delete another person's listing." });
    }

    // Handle pet listings
    if (listing.listingCategory === 'pet') {
      const pet = await Pet.findById(listing.petId);

      // Check if pet exists
      if (!pet) {
        return res.status(404).json({ message: "Pet not found." });
      }

      // Mark pet as not listed
      pet.isListed = false;
      pet.listingPrice = 0
      pet.listingNo =""
      await pet.save();
    } else {
      // Handle item listings
      const itemCheck = user.inventory.find(item => item.itemId.toString() === listing.item._id.toString());

      if (!itemCheck) {
        // If item is not in inventory, add it
        const item = await Item.findById(listing.item._id);
        if (!item) {
          return res.status(404).json({ message: "Item not found." });
        }

        user.inventory.push({
          itemId: item._id,
          quantity: 1,
        });
      } else {
        // If item is in inventory, update its quantity and isListed status
        itemCheck.quantity++;
      }

      await user.save();
    }

    // Delete the listing from the Market collection
    await listing.deleteOne();

    // Respond with success message
    res.status(200).json({
      message: "Listing deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ message: "An error occurred while deleting the listing." });
    next(error);
  }
};

const BuySystemListing = async (req, res, next) => {
  try {
    const buyerId = req.user._id;
    const { listingNo } = req.body;

    // Validate inputs
    if (!listingNo) {
      return res.status(400).json({ message: "Listing number is require." });
    }

    // Find the listing by listingNumber and populate the appropriate fields
    const listing = await Market.findOne({ listingNumber: listingNo })
      .populate({
        path: 'pet',
        populate: {
          path: 'petInfo',
          select: '-baseHealth -baseAttack -baseDefense -baseManaCost'
        },
        match: { $expr: { $eq: ['$listingCategory', 'pet'] } }
      })
      .populate({
        path: 'item',
        match: { $expr: { $eq: ['$listingCategory', 'item'] } }
      });

    // Check if listing exists
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if(listing.buyerId){
        return res.status(400).json({ message: "Listing already has a buyer." });
    }

    // Find the buyer by ID
    const buyer = await User.findById(buyerId);

    // Check if buyer exists
    if (!buyer) {
      return res.status(404).json({ message: "User not found." });
    }


    // Calculate the buyer's total currency in silver
    const buyerTotalSilver = buyer.profile.Argentum + (buyer.profile.Aureus * 100);

    // Check if user has enough silver to buy the listing
    if (buyerTotalSilver < listing.priceInSilver) {
      return res.status(403).json({ message: "Insufficient funds to buy this listing." });
    }

    // Calculate the new total silver for the buyer after the purchase
    const newBuyerTotalSilver = buyerTotalSilver - listing.priceInSilver;

    

    // Handle pet listings
    if (listing.listingCategory === 'pet') {
      const pet = await Pet.findById(listing.petId);

      // Check if pet exists
      if (!pet) {
        return res.status(404).json({ message: "Pet not found." });
      }


      // Update pet ownership details
      pet.userProfile.previousUsers.push(listing.sellerId);
      pet.userProfile.userId = buyer._id;
      pet.userProfile.username = buyer.username;
      pet.userProfile.coverImage = buyer.profile.avatar;
      pet.isSystem = false;
      pet.isListed = false;
      pet.listingNo=""
      pet.listingPrice = 0
      await pet.save();
      listing.isSold = true
      await listing.save()

    } else {
      // Handle item listings
      const itemCheck = buyer.inventory.find(item => item.itemId.toString() === listing.item._id.toString());

      if (!itemCheck) {
        // If item is not in inventory, add it
        const item = await Item.findById(listing.item._id);
        if (!item) {
          return res.status(404).json({ message: "Item not found." });
        }

        buyer.inventory.push({
          itemId: item._id,
          quantity: 1,
        });
      } else {
        // If item is in inventory, update its quantity
        itemCheck.quantity++;
      }

      await buyer.save();
    }

    // Update buyer and seller currency after the transaction
    buyer.profile.Argentum = newBuyerTotalSilver;
    buyer.profile.Aureus = 0; // Reset Aureus as all were converted to Argentum

    listing.isSold = true
    await buyer.save();
    await listing.save(); 

    // Respond with success message
    res.status(200).json({
      message: "Listing bought successfully.",
    });

  } catch (error) {
    console.error("Error processing listing purchase:", error);
    res.status(500).json({ message: "An error occurred while processing the listing purchase." });
    next(error);
  }
};







module.exports ={
createListing,
viewAllListings,
getAListing,
UpdateAListing,
DeleteAListing
}