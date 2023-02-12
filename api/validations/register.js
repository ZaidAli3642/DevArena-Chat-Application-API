const Joi = require("joi");

const RegisterSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9_]*$/)
    .required()
    .label("Username"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(8).max(16).required().label("Password"),
});

const validateRegisteredUser = (body) => RegisterSchema.validate(body);

module.exports = validateRegisteredUser;
