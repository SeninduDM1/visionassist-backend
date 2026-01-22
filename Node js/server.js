const express = require("express");
const app = express();

app.use(express.json());

const alertRoutes = require("./routes/alertRoutes");

app.use("/api/alert", alertRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
