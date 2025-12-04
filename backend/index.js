const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Check environment variables on startup
console.log("Checking environment variables...");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "is set" : "is not set");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "is set" : "is not set");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("WARNING: Email <configura></configura>tion is missing!");
  console.error(
    "Please make sure you have created a .env file with EMAIL_USER and EMAIL_PASS"
  );
} else {
  console.log("Email configuration is present");
}

// Configure CORS
const corsOptions = {
  origin: [
    "https://gofood-frontend-cyvsjt97f-prajnesh111s-projects.vercel.app",
    "https://gofood-frontend-jju7t7qtq-prajnesh111s-projects.vercel.app",
    "https://gofood-frontend-2v48v50dw-prajnesh111s-projects.vercel.app",
    "https://gofood-frontend-ml7v22am0-prajnesh111s-projects.vercel.app",
    "https://gofood-frontend-two.vercel.app",
    "http://localhost:3000",
    "https://gofood-frontend-bvxi634mi-prajnesh111s-projects.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "auth-token", "Accept"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Connect to MongoDB and preload food data globals
const connectMongoDB = require("./db");
connectMongoDB().catch((err) => {
  console.error("Failed to connect MongoDB on startup:", err);
  process.exit(1);
});

// Define your routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", require("./Routes/CreateUser"));
app.use("/api", require("./Routes/DisplayData"));
app.use("/api", require("./Routes/OrderData"));
app.use("/api", require("./Routes/emailRoutes"));

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
