const router = require("express").Router();
const handleErrors = require("../../utils/errors");
const { auth } = require("../middleware");
const { Messages } = require("../models");
const { validateMessage } = require("../validations");

router.post("/messages", auth, validateMessage, async (req, res, next) => {
  try {
    const { message: messageText, conversationId } = req.body;

    const message = new Messages({
      message: messageText,
      conversationId,
    });

    await message.save();

    res.status(200).json({
      success: true,
      message: "Message sent!",
    });
  } catch (error) {
    const err = handleErrors(error);
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
