const router = require("express").Router();
const bcrypt = require("bcrypt");
const generateToken = require("../../utils/generate-web-token");

const { User } = require("../models");
const validateRegisteredUser = require("../validations/register");

// Register Route
router.post("/register", async (req, res) => {
  const { error } = validateRegisteredUser(req.body);

  try {
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    const savedUser = await user.save();

    const token = generateToken({
      _id: savedUser._id,
      name: savedUser.name,
      username: savedUser.username,
      email: savedUser.email,
    });

    res.setHeader("x-auth-token", token).status(201).json({
      success: true,
      message: "User Registered",
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.username)
      return res.status(500).json({ message: "username is already taken." });
    if (error.code === 11000 && error.keyPattern?.email)
      return res.status(500).json({ message: "Email is already registered." });

    res.status(500).json({ message: "Something went wrong.", error });
  }
});

module.exports = router;
