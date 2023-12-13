const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },  
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl:{
    type: String,
    required: false,
  },
  accessToken: {
    type: String,
    required: false,
  },
  restToken: String,
  restTokenExpirtion: Date,
});

module.exports = mongoose.model("User", userSchema);