const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");
    await fetchData();
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err.message);
    throw err;
  }
};

const fetchData = async () => {
  try {
    // List all collections to help debug
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📋 Available collections:", collections.map(c => c.name).join(", "));

    const fetched_data = await mongoose.connection.db
      .collection("foodData2")
      .find({})
      .toArray();
    const foodCategoryData = await mongoose.connection.db
      .collection("foodCategory")
      .find({})
      .toArray();

    global.foodData2 = fetched_data;
    global.foodCategory = foodCategoryData;

    console.log(`📦 Loaded ${fetched_data.length} food items, ${foodCategoryData.length} categories`);
    
    if (fetched_data.length === 0) {
      console.log("⚠️  No food items found in 'foodData2'. Check if data exists in your MongoDB Atlas database.");
    }
  } catch (err) {
    console.error("Error fetching food data:", err.message);
  }
};

module.exports = connectMongoDB;
