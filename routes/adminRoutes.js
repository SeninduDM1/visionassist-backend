const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");
const adminController = require("../controllers/adminController");

router.get("/users", auth, adminOnly, adminController.getAllUsers);

module.exports = router;
