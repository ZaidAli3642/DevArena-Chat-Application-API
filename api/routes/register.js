const router = require("express").Router();
const bcrypt = require("bcrypt");
const generateToken = require("../../utils/generate-web-token");

const { User } = require("../models");
const validateRegisteredUser = require("../validations/register");

// Register Route
router.post("/", async (req, res) => {
  const { error } = validateRegisteredUser(req.body);

  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    await user.save();

    const token = generateToken({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
    });

    res.setHeader("x-auth-token", token).status(201).json({
      success: true,
      message: "User Registered",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
