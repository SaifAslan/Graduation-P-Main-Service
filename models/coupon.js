const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the coupon document
const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  minimumTotal: {
    type: Number,
    default: 0,
  },
  maximumTotal: {
    type: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // You can include additional fields as needed for your coupon schema
});

// Create a Mongoose model based on the schema
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
