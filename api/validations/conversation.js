const Joi = require("joi");

const ConversationSchema = Joi.object({
  senderId: Joi.string().required().label("Sender Id"),
  receiverId: Joi.string().required().label("Receiver Id"),
});

const validateConversation = (req, res, next) => {
  const { error } = ConversationSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

module.exports = validateConversation;
