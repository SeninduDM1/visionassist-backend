const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    system: "VisionAssist",
    status: "Running",
    time: new Date()
  });
});


app.post("/api/alert", (req, res) => {
  const data = req.body;

  res.json({
    message: "Alert received",
    alertData: data
  });
});


// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

