const Joi = require("joi");

const MessageSchema = Joi.object({
  message: Joi.string().required().label("Message"),
  conversationId: Joi.string().required().label("Conversation Id"),
  sender: Joi.string().required().label("Sender Id"),
});

const validateMessage = (req, res, next) => {
  const { error } = MessageSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

module.exports = validateMessage;
