const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderItemSchema = new Schema(
  {
    foodId: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    img: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "online"],
      default: "COD",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema);
