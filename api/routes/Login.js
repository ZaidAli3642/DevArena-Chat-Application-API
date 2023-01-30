const router = require("express").Router();
const bcrypt = require("bcrypt");

const generateToken = require("../../utils/generate-web-token");
const { User } = require("../models");
const { validateLogin } = require("../validations");

router.post("/", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ message: "User not found." });

    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result)
      return res.status(401).json({ message: "Password not matched." });

    const token = generateToken({
      name: user.name,
      email: user.email,
      username: user.username,
    });

    res.setHeader("x-auth-token", token).status(200).json({
      success: true,
      message: "User logged in",
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
