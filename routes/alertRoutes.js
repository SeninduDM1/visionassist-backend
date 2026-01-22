const express = require("express");
const router = express.Router();

// Import controller
const alertController = require("../controllers/alertController");
const auth = require("../middleware/authMiddleware");

// Define routes
router.post("/fall", auth, alertController.fallAlert);
router.post("/sos", auth, alertController.sosAlert);
router.get("/user/:userId", auth, alertController.getUserAlerts);



// Export router
module.exports = router;
