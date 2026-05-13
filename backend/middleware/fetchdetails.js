const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied. No token provided." });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "QuickBite_Secret_2025";
    const data = jwt.verify(token, jwtSecret);
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token." });
  }
};

module.exports = fetchUser;
