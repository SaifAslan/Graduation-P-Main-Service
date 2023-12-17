const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  // You can add more fields based on your specific requirements
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
