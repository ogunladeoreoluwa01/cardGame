const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
    type: {
    type: String,
    required: true,
    enum: ['pet', "account", 'comingsoon']
  },
  effectType: {
    type: String,
    required: true,
    enum: ['tier1', 'tier2', 'tier3', 'tier4']
  },
  itemImage: {
    type: String,
    required: true,
  },
  effect: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
