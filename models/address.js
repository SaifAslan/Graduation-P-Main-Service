const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the address document
const addressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
    default: false,
  },
  title:{
    type: String,
    required: true,
  }
  // Additional fields as needed for your address schema
});

// Create a Mongoose model based on the schema
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
