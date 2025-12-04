// const mongoose = require('mongoose');

// const mongoURI = 'mongodb+srv://gofood:Prajnesh%402001@cluster0.reyts.mongodb.net/gofoodmern?ssl=true&replicaSet=atlas-zud2s3-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

// const connectMongoDB = async () => {
//     try {
//         await mongoose.connect(mongoURI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true, // Recommended for new mongoose projects
//         });
//         console.log("Connected to MongoDB");
//         fetchData(); // Initial fetch
//     } catch (err) {
//         console.error("Error connecting to MongoDB:", err);
//     }
// };

// // Function to fetch data every 10 seconds
// const fetchData = async () => {
//     try {
//         const fetched_data = await mongoose.connection.db.collection("foodData2").find({}).toArray();
//         const foodCategoryData = await mongoose.connection.db.collection("foodCategory").find({}).toArray();

//         global.foodData2 = fetched_data;
//         global.foodCategory = foodCategoryData;

//         console.log("Data refreshed at:", new Date().toLocaleTimeString());
//     } catch (err) {
//         console.error("Error fetching data:", err);
//     }
// };

// // Refresh data every 10 seconds
// setInterval(fetchData, 10000);

// module.exports = connectMongoDB;

const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI;
const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Recommended for new mongoose projects
    });
    console.log("Connected to MongoDB");
    fetchData(); // Initial fetch
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

// Function to fetch data once

const fetchData = async () => {
  try {
    // Drop the old unique email index if it exists
    try {
      await mongoose.connection.db.collection("orders").dropIndex("email_1");
      console.log("✅ Dropped old email_1 unique index from orders collection");
    } catch (indexErr) {
      // Index might not exist, which is fine
      if (!indexErr.message.includes("index not found")) {
        console.warn("Note:", indexErr.message);
      }
    }

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

    console.log("Data fetched at:", new Date().toLocaleTimeString());
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

module.exports = connectMongoDB;
