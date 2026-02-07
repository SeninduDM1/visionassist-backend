const User = require("../models/User");

// GET /api/users/me  (logged-in user details)
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT (authMiddleware)

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/:id/block  (admin only)
exports.blockUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { isBlocked: true },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User blocked", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/:id/unblock  (admin only)
exports.unblockUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { isBlocked: false },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User unblocked", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
