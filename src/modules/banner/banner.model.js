const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    link: {
      type: String,
    },
    status: {
      type: String,
      require: true,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const BannerModel = mongoose.model("Banner", BannerSchema);
module.exports = BannerModel;
