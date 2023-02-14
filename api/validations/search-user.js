const Joi = require("joi");

const UserSchema = Joi.object({
  name: Joi.string().label("Name"),
  username: Joi.string().label("Username"),
});

const validateSearch = (req, res, next) => {
  const { error } = UserSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

module.exports = validateSearch;
