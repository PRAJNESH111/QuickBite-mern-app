const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Authentication required." });
    }

    const user = await User.findById(req.user.id).select("role");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Admin access required." });
    }

    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res.status(500).json({ success: false, error: "Server error." });
  }
};

module.exports = adminAuth;
