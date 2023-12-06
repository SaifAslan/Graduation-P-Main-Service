const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for your document
const productSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true // This makes "id" the primary key
  },
  brand_name: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  sizes: {
    type: String,
    required: true
  },
  mrp: {
    type: String,
    required: true
  },
  sell_price: {
    type: Number,
    required: true
  },
  discount: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imageUri:{
    type: String,
    default: 'https://www.samsoe.com/dw/image/v2/BBPQ_PRD/on/demandware.static/-/Sites-samsoe-master-catalogue/default/dw0d8a840c/PIM/Samsoe/PackGreyBG/F23400102-194726TCX-10.jpg?sw=690&sh=1035&sm=fit'
  }
});

// Create a Mongoose model based on the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
