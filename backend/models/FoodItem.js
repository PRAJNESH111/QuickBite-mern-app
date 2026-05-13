const mongoose = require("mongoose");
const { Schema } = mongoose;

const FoodItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    CategoryName: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
    options: {
      type: [Schema.Types.Mixed],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodItem", FoodItemSchema, "foodData2");
