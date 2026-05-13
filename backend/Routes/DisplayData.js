const express = require("express");
const router = express.Router();

router.post("/foodData", async (req, res) => {
  try {
    res.json([global.foodData2 || [], global.foodCategory || []]);
  } catch (error) {
    console.error("Food data error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
