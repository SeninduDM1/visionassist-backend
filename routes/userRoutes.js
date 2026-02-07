const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly"); //  use your existing file
const userController = require("../controllers/userController");

//  Logged-in user's own details
router.get("/me", auth, userController.getMe);

//  Admin-only: block/unblock any user
router.patch("/:id/block", auth, adminOnly, userController.blockUser);
router.patch("/:id/unblock", auth, adminOnly, userController.unblockUser);

module.exports = router;
