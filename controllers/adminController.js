const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide passwords
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

