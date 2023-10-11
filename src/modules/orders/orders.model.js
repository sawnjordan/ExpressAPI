const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderDetails: [
      {
        id: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        price: Number,
        qty: Number,
        amt: Number,
      },
    ],
    tax: Number,
    isPaid: { type: Boolean, default: false },
    totalAmt: Number,
    shippingFee: Number,
    status: {
      type: String,
      enum: ["new", "pending", "cancelled", "delivered"],
      default: "new",
    },
    payment: {
      type: String,
      default: "cod",
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);
const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;
