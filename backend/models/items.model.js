const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
    type: {
    type: String,
    required: true,
    enum: ['pet', "account", 'lootBox']
  },
  effectType: {
    type: String,
    required: true,
    enum: ['tier1', 'tier2', 'tier3', 'tier4','tier5']
  },
  itemImage: {
    type: String,
    required: true,
  },
  effect: {
    type: Number,
    required: true,
    default:1
  },
  value: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  
},
{
    timestamps: true
  });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
