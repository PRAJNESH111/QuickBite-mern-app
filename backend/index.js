const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "auth-token", "Accept"],
  })
);

app.use(express.json());

// Connect to MongoDB
const connectMongoDB = require("./db");
connectMongoDB().catch((err) => {
  console.error("Failed to connect MongoDB:", err.message);
  process.exit(1);
});

// Health check
app.get("/", (req, res) => {
  res.json({ status: "QuickBite API is running", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.use("/api/admin", require("./Routes/AdminRoutes"));

// Start server
app.listen(port, () => {
  console.log(`🚀 QuickBite server running on http://localhost:${port}`);
});
