const Alert = require("../models/Alert");

exports.fallAlert = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    const alert = await Alert.create({
      userId,
      type: "FALL",
      latitude,
      longitude
    });

    // 🔔 ✅ UPDATED: Emit real-time FALL alert via Socket.IO
    const io = req.app.get("io");              // ✅ UPDATED
    io.emit("fallAlert", {                    // ✅ UPDATED
      userId,
      latitude,
      longitude,
      time: new Date()
    });

    res.json({
      message: "Fall alert saved & broadcasted", // ✅ UPDATED (text change)
      alertId: alert._id
    });
  } catch (err) {
    console.error(err);                         // ✅ UPDATED (better debugging)
    res.status(500).json({ message: "Server error" });
  }
};


exports.sosAlert = async (req, res) => {
  try {
    const { userId, message, latitude, longitude } = req.body;

    const alert = await Alert.create({
      userId,
      type: "SOS",
      message,
      latitude,
      longitude
    });

    // 🔔 ✅ UPDATED: Emit real-time SOS alert via Socket.IO
    const io = req.app.get("io");              // ✅ UPDATED
    io.emit("sosAlert", {                     // ✅ UPDATED
      userId,
      message,
      latitude,
      longitude,
      time: new Date()
    });

    res.json({
      message: "SOS alert saved & broadcasted", // ✅ UPDATED (text change)
      alertId: alert._id
    });
  } catch (err) {
    console.error(err);                         // ✅ UPDATED (better debugging)
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserAlerts = async (req, res) => {
  try {
    const { userId } = req.params;

    const alerts = await Alert.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      count: alerts.length,
      alerts
    });
  } catch (err) {
    console.error(err);                         // ✅ UPDATED (better debugging)
    res.status(500).json({ message: "Server error" });
  }
};
