const mongoose = require("mongoose");

const mongodbInit = async () => {
  try {
    if (process.env.MONGODB_URL) {
      await mongoose.connect(process.env.MONGODB_URL, {
        dbName: process.env.MONGODB_NAME || "express",
      });
    } else {
      await mongoose.connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.9zt3ivi.mongodb.net/express?retryWrites=true&w=majority`
      );
    }
    console.log("DB connection is established.");
  } catch (error) {
    console.log(error);
    throw { status: 500, msg: "Error establishing db connection" };
  }
};
module.exports = mongodbInit;
