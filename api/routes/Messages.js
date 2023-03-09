const router = require("express").Router();
const handleErrors = require("../../utils/errors");
const { auth } = require("../middleware");
const { Messages } = require("../models");
const { validateMessage } = require("../validations");

// Send Message
router.post("/messages", auth, validateMessage, async (req, res, next) => {
  try {
    const { message: messageText, conversationId, sender } = req.body;

    const message = new Messages({
      message: messageText,
      sender,
      conversationId,
    });

    const savedMessage = await message.save();

    res.status(200).json({
      success: true,
      message: savedMessage,
    });
  } catch (error) {
    const err = handleErrors(error);
    res.status(500).json({ success: false, message: err });
  }
});

// Get Messagess of specific person
router.get("/messages/:conversationId", auth, async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const messages = await Messages.find({ conversationId }).populate(
      "conversationId"
    );

    res.status(200).json({
      success: true,
      messages: messages,
    });
  } catch (error) {
    const err = handleErrors(error);
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
