const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Orders");
const User = require("../models/User");
const fetch = require("../middleware/fetchdetails");
const { sendOrderMail } = require("../config/mailerService");

const router = express.Router();

// Create a new order
router.post("/orderData", fetch, async (req, res) => {
  try {
    console.log("/orderData payload:", JSON.stringify(req.body));
    const { order_data, order_date } = req.body;

    if (!order_data || !Array.isArray(order_data) || order_data.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Order data is required" });
    }

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid auth token. Please log in." });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({
        success: false,
        error: "Invalid user identifier. Please log in again.",
      });
    }

    const user = await User.findById(req.user.id).select("email");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const userEmail = user.email;

    const items = order_data.map((item) => ({
      foodId: item.id,
      name: item.name,
      qty: item.qty,
      size: item.size,
      price: Number(item.price || 0),
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const orderDate = order_date ? new Date(order_date) : new Date();

    const orderDoc = await Order.create({
      user: req.user.id,
      email: userEmail,
      orderDate,
      items,
      totalAmount,
    });

    // Send order confirmation email (non-blocking)
    sendOrderMail(userEmail, {
      order_date: orderDate,
      order_data: order_data,
    }).then((sent) => {
      if (sent) {
        console.log(`📧 Order confirmation email sent to ${userEmail}`);
      }
    });

    return res.json({ success: true, orderId: orderDoc._id });
  } catch (error) {
    console.error(
      "Error in /orderData route:",
      error && error.stack ? error.stack : error
    );
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

// Get all orders for a user by JWT token
router.post("/myOrderData", fetch, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid auth token. Please log in." });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({
        success: false,
        error: "Invalid user identifier. Please log in again.",
      });
    }

    const user = await User.findById(req.user.id).select("email");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const userEmail = user.email;

    // Search by email (most reliable - orders were saved with email)
    const orders = await Order.find({ email: userEmail }).sort({
      createdAt: -1,
    });

    return res.json({ success: true, orderData: { orders } });
  } catch (error) {
    console.error("❌ Error in /myOrderData route:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}); // Debug route - get all orders in database (remove after testing)
router.get("/debug/allOrders", async (req, res) => {
  try {
    console.log("🔍 Debug route called - fetching all orders and users");
    const orders = await Order.find().lean();
    const users = await User.find().select("email name").lean();

    console.log(`Found ${orders.length} orders and ${users.length} users`);

    return res.json({
      success: true,
      totalOrders: orders.length,
      totalUsers: users.length,
      orders: orders,
      users: users,
    });
  } catch (error) {
    console.error("❌ Debug route error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Debug route - Get orders for a specific email
router.get("/debug/ordersForEmail/:email", async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`🔍 Fetching orders for email: ${email}`);

    const orders = await Order.find({ email }).lean();
    console.log(`Found ${orders.length} orders for ${email}`);

    return res.json({
      success: true,
      email,
      ordersCount: orders.length,
      orders,
    });
  } catch (error) {
    console.error("❌ Debug route error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
