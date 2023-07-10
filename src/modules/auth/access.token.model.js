const mongoose = require("mongoose");

const personalAccessTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const PersonalAccessTokenModel = mongoose.model(
  "PersonalAccessToken",
  personalAccessTokenSchema
);
module.exports = PersonalAccessTokenModel;
