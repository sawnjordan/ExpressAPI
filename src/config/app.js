const express = require("express");
const router = require("../routes");
const cookieParser = require("cookie-parser");
const mongodbInit = require("./mongo.config");

const app = express();
mongodbInit();

//if your content type is application/json us this middleware
app.use(express.json());

//if your content type is application/x-www-from-urlencoded
app.use(express.urlencoded({ extended: false }));

//to use cookie
app.use(cookieParser());

app.use("/api/v1", router);

//this is express global error handling middleware. The first parameter is always err.
app.use((err, req, res, next) => {
  console.log(err);
  let statusCode = err.status || 500;
  let msg = err.msg || "Internal Server Error.";
  res.status(statusCode).json({ data: null, msg: msg, meta: null });
});

module.exports = app;
