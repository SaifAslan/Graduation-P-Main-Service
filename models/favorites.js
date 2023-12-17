const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the favorites document
const favoritesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
  // You can include additional fields as needed for your favorites schema
});

// Create a Mongoose model based on the schema
const Favorites = mongoose.model('Favorites', favoritesSchema);

module.exports = Favorites;
