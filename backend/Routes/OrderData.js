const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Orders");
const User = require("../models/User");
const fetchUser = require("../middleware/fetchdetails");

const router = express.Router();

// POST /api/orderData — Create a new order
router.post("/orderData", fetchUser, async (req, res) => {
  try {
    const { order_data, order_date, deliveryAddress } = req.body;

    if (!order_data || !Array.isArray(order_data) || order_data.length === 0) {
      return res.status(400).json({ success: false, error: "Order data is required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Please log in." });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ success: false, error: "Invalid user. Please log in again." });
    }

    const user = await User.findById(req.user.id).select("email location");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const items = order_data.map((item) => ({
      foodId: item.id,
      name: item.name,
      qty: item.qty,
      size: item.size,
      price: Number(item.price || 0),
      img: item.img || "",
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const orderDate = order_date ? new Date(order_date) : new Date();

    const orderDoc = await Order.create({
      user: req.user.id,
      email: user.email,
      orderDate,
      items,
      totalAmount,
      status: "pending",
      deliveryAddress: deliveryAddress || user.location || "",
      paymentMethod: "COD",
    });

    return res.json({ success: true, orderId: orderDoc._id });
  } catch (error) {
    console.error("Order creation error:", error.message);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// POST /api/myOrderData — Get all orders for logged-in user
router.post("/myOrderData", fetchUser, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: "Please log in." });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ success: false, error: "Invalid user. Please log in again." });
    }

    const user = await User.findById(req.user.id).select("email");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const orders = await Order.find({ email: user.email }).sort({ createdAt: -1 });
    return res.json({ success: true, orderData: { orders } });
  } catch (error) {
    console.error("My orders error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
