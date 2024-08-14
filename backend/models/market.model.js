const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketSchema = new mongoose.Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  listingNumber:{type:String,required:true},
  listingCategory: {
    type: String,
    required: true,
    enum: ['pet', 'item']
},
  petId: {
    type: Schema.Types.ObjectId,
    ref: "Pet",
    required: function() { return this.listingCategory === 'pet'; }
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: function() { return this.listingCategory === 'item'; }
  },
  sideNote: {
    type: String,
  },
  priceInSilver: {
    type: Number,
    required: true
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isSold:{
    type: Boolean,
    default: false
  } 
}, {
  timestamps: true
});

const Market = mongoose.model('Market', marketSchema);

module.exports = Market;
