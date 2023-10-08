const mongoose = require("mongoose");

//string, number, array, boolean, objectID,date
//_id => primary key, objectId(), _v => version
const UserSchema = new mongoose.Schema(
  {
    //TODO:
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: String,
    address: {
      shippingAddress: {
        type: String,
        require: true,
      },
      billingAddress: {
        type: String,
        require: true,
      },
    },
    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      default: "customer",
    },
    image: String,
    phone: String,
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    createdBy: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    activationToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, autoCreate: true, autoIndex: true }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
