const mongoose = require("mongoose");

const MessagesModal = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Messages", MessagesModal);
