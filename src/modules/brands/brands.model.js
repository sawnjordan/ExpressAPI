const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
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
    logo: {
      type: String,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);
const BrandModel = mongoose.model("Brand", BrandSchema);
module.exports = BrandModel;
