const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchdetails");

const getJwtSecret = () => process.env.JWT_SECRET || "QuickBite_Secret_2025";

// POST /api/createuser — Register new user
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({ min: 5 }),
    body("name", "Name must be at least 3 characters").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email.toLowerCase() });
      if (user) {
        return res.status(400).json({ success, error: "Email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const securePass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: securePass,
        email: req.body.email.toLowerCase(),
        location: req.body.location || "",
        phone: req.body.phone || "",
      });

      const data = {
        user: { id: user.id, role: user.role },
      };

      const authToken = jwt.sign(data, getJwtSecret());
      success = true;
      res.json({ success, authToken, userName: user.name, userRole: user.role });
    } catch (error) {
      console.error("Create user error:", error.message);
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ success: false, errors: messages });
      }
      res.status(500).json({ success: false, error: "Server error" });
    }
  }
);

// POST /api/login — Authenticate user
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      const pwdCompare = await bcrypt.compare(password, user.password);
      if (!pwdCompare) {
        return res.status(400).json({ success, error: "Invalid credentials" });
      }

      const data = {
        user: { id: user.id, role: user.role },
      };

      const authToken = jwt.sign(data, getJwtSecret());
      success = true;
      res.json({
        success,
        authToken,
        userName: user.name,
        userRole: user.role,
        userEmail: user.email,
      });
    } catch (error) {
      console.error("Login error:", error.message);
      res.status(500).json({ success, error: "Server error" });
    }
  }
);

// POST /api/getuser — Get logged in user details
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/profile — Update user profile
router.put("/profile", fetchUser, async (req, res) => {
  try {
    const { name, phone, location, address } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
