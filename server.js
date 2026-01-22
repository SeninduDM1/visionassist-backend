// server.js (FULL UPDATED)

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const connectDB = require("./config/db");

// Allow Frontend
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Import routes
const alertRoutes = require("./routes/alertRoutes");
const authRoutes = require("./routes/authRoutes");

// Basic test route
app.get("/", (req, res) => {
  res.send("Server is working");
});

// Use routes
app.use("/api/alert", alertRoutes);
app.use("/api/auth", authRoutes);

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Make io accessible in controllers via req.app.get("io")
app.set("io", io);

// Socket connection logs (optional but helpful)
io.on("connection", (socket) => {
  console.log("🟢 Socket client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket client disconnected:", socket.id);
  });
});

// ✅ UPDATED: Use dynamic port for Render (and fallback to 5000 locally)
const PORT = process.env.PORT || 5000; // ✅ UPDATED

// Start server ONLY after DB connects
const startServer = async () => {
  try {
    console.log("✅ About to connect DB...");
    await connectDB();
    console.log("✅ MongoDB connected. Starting server...");

    // ✅ UPDATED: Use server.listen(PORT) instead of hardcoding 5000
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`); // ✅ UPDATED
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
