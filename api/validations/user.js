const Joi = require("joi");

const UserSchema = Joi.object({
  type: Joi.number().valid(1, 2),
  name: Joi.alternatives().conditional("type", {
    is: 1,
    then: Joi.string().label("Name"),
    otherwise: Joi.string().required().label("Name"),
  }),
  imageUri: Joi.string().label("Image"),
});

const validateUser = (req, res, next) => {
  const { error } = UserSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

module.exports = validateUser;
