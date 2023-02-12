const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
});

module.exports = mongoose.model("User", UserModel);
