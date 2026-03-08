const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");
const adminController = require("../controllers/adminController");

// Admin Register
router.post("/register", adminController.adminRegister);

// Admin Login
router.post("/login", adminController.adminLogin);

// Get all users (admin only)
router.get("/", auth, adminOnly, adminController.getAllUsers);

module.exports = router;
