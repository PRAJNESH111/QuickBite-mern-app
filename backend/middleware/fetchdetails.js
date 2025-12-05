var jwt = require("jsonwebtoken");
const jwtSecret = "HaHa";
const fetch = (req, res, next) => {
  // get the user from the jwt token and add id to req object
  const token = req.header("auth-token");
  console.log(
    "🔍 fetchdetails middleware - token present:",
    token ? "yes" : "no"
  );

  if (!token) {
    console.log("❌ No token in header");
    return res.status(401).send({ error: "Invalid Auth Token" });
  }

  try {
    const data = jwt.verify(token, jwtSecret);
    console.log("✅ Token verified. JWT data:", data);
    req.user = data.user;
    console.log("✅ req.user set to:", req.user);
    next();
  } catch (error) {
    console.log("❌ Token verification failed:", error.message);
    return res.status(401).send({ error: "Invalid Auth Token" });
  }
};
module.exports = fetch;
