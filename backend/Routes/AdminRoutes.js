const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchdetails");
const adminAuth = require("../middleware/adminAuth");
const Order = require("../models/Orders");
const User = require("../models/User");
const FoodItem = require("../models/FoodItem");
const mongoose = require("mongoose");

// All admin routes require auth + admin role
router.use(fetchUser);
router.use(adminAuth);

// GET /api/admin/dashboard — Dashboard stats
router.get("/dashboard", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalFood = await FoodItem.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const preparingOrders = await Order.countDocuments({ status: "preparing" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email");

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalUsers,
        totalFood,
        totalRevenue,
        pendingOrders,
        preparingOrders,
        deliveredOrders,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/admin/orders — All orders with optional status filter
router.get("/orders", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== "all") filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "name email phone");

    const total = await Order.countDocuments(filter);

    res.json({ success: true, orders, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Admin orders error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// PUT /api/admin/order/:id/status — Update order status
router.put("/order/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid order ID" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Update order status error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/admin/food — Get all food items
router.get("/food", async (req, res) => {
  try {
    const foods = await FoodItem.find().sort({ CategoryName: 1, name: 1 });
    res.json({ success: true, foods });
  } catch (error) {
    console.error("Admin food list error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// POST /api/admin/food — Add food item
router.post("/food", async (req, res) => {
  try {
    const { name, CategoryName, img, options, description, isVeg, rating } = req.body;

    if (!name || !CategoryName || !img || !options) {
      return res.status(400).json({ success: false, error: "Name, category, image, and options are required" });
    }

    const food = await FoodItem.create({
      name,
      CategoryName,
      img,
      options: Array.isArray(options) ? options : [options],
      description: description || "",
      isVeg: isVeg || false,
      rating: rating || 4.0,
      isAvailable: true,
    });

    // Refresh global cache
    await refreshGlobalFoodData();

    res.json({ success: true, food });
  } catch (error) {
    console.error("Add food error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// PUT /api/admin/food/:id — Update food item
router.put("/food/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid food ID" });
    }

    const updateData = {};
    const fields = ["name", "CategoryName", "img", "options", "description", "isVeg", "rating", "isAvailable"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const food = await FoodItem.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!food) {
      return res.status(404).json({ success: false, error: "Food item not found" });
    }

    await refreshGlobalFoodData();

    res.json({ success: true, food });
  } catch (error) {
    console.error("Update food error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// DELETE /api/admin/food/:id — Delete food item
router.delete("/food/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid food ID" });
    }

    const food = await FoodItem.findByIdAndDelete(id);
    if (!food) {
      return res.status(404).json({ success: false, error: "Food item not found" });
    }

    await refreshGlobalFoodData();

    res.json({ success: true, message: "Food item deleted" });
  } catch (error) {
    console.error("Delete food error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// GET /api/admin/users — Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    // Get order counts per user
    const orderCounts = await Order.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 }, totalSpent: { $sum: "$totalAmount" } } },
    ]);

    const orderMap = {};
    orderCounts.forEach((o) => {
      orderMap[o._id?.toString()] = { count: o.count, totalSpent: o.totalSpent };
    });

    const usersWithStats = users.map((u) => {
      const stats = orderMap[u._id.toString()] || { count: 0, totalSpent: 0 };
      return { ...u.toObject(), orderCount: stats.count, totalSpent: stats.totalSpent };
    });

    res.json({ success: true, users: usersWithStats });
  } catch (error) {
    console.error("Admin users error:", error.message);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Helper to refresh global food data cache
async function refreshGlobalFoodData() {
  try {
    const mongoose = require("mongoose");
    const fetched_data = await mongoose.connection.db.collection("foodData2").find({}).toArray();
    const foodCategoryData = await mongoose.connection.db.collection("foodCategory").find({}).toArray();
    global.foodData2 = fetched_data;
    global.foodCategory = foodCategoryData;
  } catch (err) {
    console.error("Failed to refresh food data cache:", err.message);
  }
}

module.exports = router;
