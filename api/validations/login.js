const Joi = require("joi");

const LoginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(8).max(16).required().label("Password"),
});

const validateLogin = (body) => LoginSchema.validate(body);

module.exports = validateLogin;
