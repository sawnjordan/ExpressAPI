const mongoose = require("mongoose");
require("dotenv").config();

const clearDb = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
    const dbName = process.env.MONGODB_NAME || "express";
    
    console.log(`Connecting to MongoDB at ${mongoUrl} (db: ${dbName})...`);
    await mongoose.connect(mongoUrl, { dbName });
    console.log("Connected successfully.");

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      console.log(`Dropping collection: ${collection.collectionName}...`);
      await collection.deleteMany({});
    }
    
    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    mongoose.connection.close();
  }
};

clearDb();
