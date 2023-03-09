const router = require("express").Router();
const mongoose = require("mongoose");

const handleErrors = require("../../utils/errors");
const { auth } = require("../middleware");
const { Conversation } = require("../models");
const { validateConversation } = require("../validations");
const lookup = require("../../utils/lookup");

// CREATE CONVERSATION OF SPECIFIC USER
router.post("/conversation", auth, validateConversation, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: {
        $all: [
          mongoose.Types.ObjectId(req.body.senderId),
          mongoose.Types.ObjectId(req.body.receiverId),
        ],
      },
    });

    if (conversation.length > 0)
      return res.status(200).json({
        message: "Conversation already created.",
        conversation,
      });

    const newConversation = new Conversation({
      members: [
        mongoose.Types.ObjectId(req.body.senderId),
        mongoose.Types.ObjectId(req.body.receiverId),
      ],
    });

    const createdConversation = await newConversation.save();

    res.status(200).json({
      success: true,
      message: "conversation created!",
      conversation: createdConversation,
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
    const conversation = await Conversation.aggregate([
      { $match: { members: { $in: [mongoose.Types.ObjectId(userId)] } } },
      {
        $lookup: {
          ...lookup("messages", "_id", "conversationId", "messages"),

          pipeline: [{ $sort: { _id: -1 } }, { $limit: 1 }],
        },
      },
      {
        $lookup: lookup("users", "members", "_id", "users"),
      },
      { $match: { "messages.0": { $exists: true } } },
      {
        $project: {
          _id: 1,
          senderId: 1,
          receiverId: 1,
          conversationId: 1,
          "messages.conversationId": 1,
          "messages._id": 1,
          "messages.message": 1,
          "users._id": 1,
          "users.email": 1,
          "users.username": 1,
          "users.name": 1,
          "users.imageUri": 1,
        },
      },
    ]);

    res.status(200).json({ message: "All Conversations", conversation });
  } catch (error) {
    const err = handleErrors(error);
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
