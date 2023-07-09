const mongoose = require("mongoose");

const mongodbInit = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_NAME,
    });
    console.log("DB connection is established.");
  } catch (error) {
    console.log(error);
    throw { status: 500, msg: "Error establishing db connection" };
  }
};
module.exports = mongodbInit;
