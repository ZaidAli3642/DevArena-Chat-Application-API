const router = require("express").Router();
const mongoose = require("mongoose");

const handleErrors = require("../../utils/errors");
const { auth } = require("../middleware");
const { Conversation } = require("../models");
const { validateConversation } = require("../validations");
const lookup = require("../../utils/lookup");

// CREATE CONVERSATION OF SPECIFIC USER
router.post("/converstaion", auth, validateConversation, async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    const conversation = new Conversation({
      conversationId: mongoose.Types.ObjectId(),
      senderId: senderId,
      receiverId: receiverId,
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      message: "conversation created!",
    });
  } catch (error) {
    const err = handleErrors(error);
    res.status(500).json({ success: false, message: err });
  }
});

// GET CONVERSATION OF SPECIFIC USER
router.get("/conversation/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const converstation = await Conversation.aggregate([
      { $match: { senderId: mongoose.Types.ObjectId(userId) } },
      {
        $lookup: lookup("messages", "_id", "conversationId", "messages"),
      },
      {
        $lookup: lookup("users", "senderId", "_id", "sender"),
      },
      {
        $lookup: lookup("users", "receiverId", "_id", "receiver"),
      },
      {
        $project: {
          _id: 1,
          senderId: 1,
          receiverId: 1,
          conversationId: 1,
          "messages.conversationId": 1,
          "messages._id": 1,
          "messages.message": 1,
          "sender._id": 1,
          "sender.email": 1,
          "sender.username": 1,
          "sender.name": 1,
          "receiver._id": 1,
          "receiver.email": 1,
          "receiver.username": 1,
          "receiver.name": 1,
        },
      },
    ]);

    res.status(200).json({ message: "All Conversations", converstation });
  } catch (error) {
    const err = handleErrors(error);
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
