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
    ).select("_id username email name imageUri");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found" });

    res.status(200).json({ success: true, message: "User Updated.", user });
  } catch (error) {
    const err = handleErrors(error);
    console.log("ERRROR : ", err);
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/users/search/:userId", auth, async (req, res) => {
  try {
    const { search } = req.query;
    const { userId } = req.params;

    console.log("user id: ", userId);

    if (!search)
      return res
        .status(404)
        .json({ success: false, message: "You need to provide search query" });

    const searchResult = await User.find({
      $or: [
        { username: { $regex: new RegExp(search, "i") }, _id: { $ne: userId } },
        { name: { $regex: new RegExp(search, "i") }, _id: { $ne: userId } },
      ],
    }).select("username email name _id imageUri");

    res
      .status(200)
      .json({ success: true, message: "Search results", users: searchResult });
  } catch (error) {
    const err = handleErrors(error);
    res.status(500).json({ success: false, err: err });
  }
});

module.exports = router;
