const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        require: true,
      },
    ],
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    description: {
      type: String,
      require: true,
    },
    costPrice: {
      type: Number,
      require: true,
      min: 0,
    },
    price: {
      type: Number,
      require: true,
      min: 1,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    afterDiscount: {
      type: Number,
      require: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    images: [
      {
        type: String,
        required: false,
      },
    ],
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);
const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
