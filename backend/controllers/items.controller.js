const User = required("../models/user.model.js")
const Market = required("../models/market.model.js")
const Pet = required("../models/pet.model.js")
const Item = required("../models/items.model.js")




const createItem = async (req, res) => {
  try {
    const { name, type, effectType, itemImage, effect, value, description } = req.body;

    // Validate the request body
    if (!name || !type || !effectType || !itemImage || !effect || !value || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new item entry
    const newItemEntry = new Item({
      name,
      type,
      effectType,
      itemImage,
      effect,
      value,
      description
    });

    await newItemEntry.save();
    res.status(201).json({ message: "Item created successfully.", item: newItemEntry });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "An error occurred while creating the item." });
  }
};


const consumeItemAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the item by ID
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item does not exist." });
    }

    if (item.type !== "account") {
      return res.status(400).json({ message: "Item is not for account." });
    }

    // Handle item check in user inventory
    const itemCheck = user.inventory.find(invItem => invItem.itemId.toString() === item._id.toString());

    if (!itemCheck) {
      return res.status(404).json({ message: "Item not found in user inventory." });
    }

    if (itemCheck.quantity <= 0) {
      return res.status(400).json({ message: "Item quantity is 0, user has nothing to use." });
    }

    // Function to get the item tier multiplier
    const getTierMultiplier = (tier) => {
      switch (tier) {
        case "tier5": return 10;
        case "tier4": return 8;
        case "tier3": return 3;
        case "tier2": return 2;
        case "tier1": return 1;
        default: return 1;
      }
    };

    // Calculate level to add for the user
    const levelToAdd = item.effect * getTierMultiplier(item.effectType);

    // Consume the item
    user.profile.level += levelToAdd;
    itemCheck.quantity--;

    await user.save();

    res.status(200).json({ message: `Item used. ${levelToAdd} levels added to your account.` });
  } catch (error) {
    console.error("Error consuming item:", error);
    res.status(500).json({ message: "An error occurred while consuming the item." });
    next(error);
  }
};


const consumeItemPet = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { itemId, petId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the item by ID
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item does not exist." });
    }

    // Find the pet by ID
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet does not exist." });
    }

    if (item.type !== "pet") {
      return res.status(400).json({ message: "Item is not for pet." });
    }

    // Check if user is the owner of the pet
    if (userId.toString() !== pet.userProfile.userId.toString()) {
      return res.status(403).json({ message: "You are not the owner of the selected pet." });
    }

    // Handle item check in user inventory
    const itemCheck = user.inventory.find(invItem => invItem.itemId.toString() === item._id.toString());

    if (!itemCheck) {
      return res.status(404).json({ message: "Item not found in user inventory." });
    }

    if (itemCheck.quantity <= 0) {
      return res.status(400).json({ message: "Item quantity is 0, user has nothing to use." });
    }

    // Function to get the item tier multiplier
    const getTierMultiplier = (tier) => {
      switch (tier) {
        case "tier5": return 10;
        case "tier4": return 8;
        case "tier3": return 3;
        case "tier2": return 2;
        case "tier1": return 1;
        default: return 1;
      }
    };

    // Calculate level to add for the pet
    const levelToAdd = item.effect * getTierMultiplier(item.effectType);

    // Consume the item
    pet.level += levelToAdd;
    itemCheck.quantity--;

    await pet.save();

    res.status(200).json({ message: `Item used. ${levelToAdd} levels added to your pet.` });
  } catch (error) {
    console.error("Error consuming item:", error);
    res.status(500).json({ message: "An error occurred while consuming the item." });
    next(error);
  }
};










module.exports ={
createListing,
ViewListing,
getAListing,
UpdateAListing,
DeleteAListing
}