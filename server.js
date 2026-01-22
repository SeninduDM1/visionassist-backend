require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");                 // ✅ UPDATED (new)
const { Server } = require("socket.io");      // ✅ UPDATED (new)

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

// ✅ UPDATED (new): Create HTTP server from Express app
const server = http.createServer(app);

// ✅ UPDATED (new): Attach Socket.IO to the server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ UPDATED (new): Make io accessible in controllers via req.app.get("io")
app.set("io", io);

// ✅ UPDATED (new): Socket connection logs (optional but helpful)
io.on("connection", (socket) => {
  console.log("🟢 Socket client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Socket client disconnected:", socket.id);
  });
});

// ✅ UPDATED (new): Start server ONLY after DB connects
const startServer = async () => {
  try {
    console.log("✅ About to connect DB...");
    await connectDB();
    console.log("✅ MongoDB connected. Starting server...");

    // ✅ UPDATED (new): Use server.listen instead of app.listen
    server.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer(); // ✅ UPDATED (new)
