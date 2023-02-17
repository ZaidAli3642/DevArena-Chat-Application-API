const Joi = require("joi");

const UserSchema = Joi.object({
  search: Joi.string().required().label("Search"),
});

const validateSearch = (req, res, next) => {
  const { error } = UserSchema.validate(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

module.exports = validateSearch;
