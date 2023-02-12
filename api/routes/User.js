const router = require("express").Router();

const User = require("../models/User");
const handleErrors = require("../../utils/errors");
const { auth } = require("../middleware");
const validateUser = require("../validations/user");

router.put("/user/:userId", auth, validateUser, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $set: {
          ...req.body,
        },
      },
      { new: 1 }
    ).select("_id username email name");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });

    res.status(200).json({ success: true, message: "User Updated.", user });
  } catch (error) {
    const err = handleErrors(error);
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
