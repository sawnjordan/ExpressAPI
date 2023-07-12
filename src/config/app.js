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
  if (err.code === 11000 && err.keyPattern && err.keyValue) {
    const fieldName = Object.keys(err.keyPattern)[0];
    const fieldValue = err.keyValue[fieldName];

    res.status(400).json({
      error: `Duplicate value '${fieldValue}' for field '${fieldName}.'`,
    });
  }

  if (err.name === "CastError") {
    return res.status(401).json({
      status: 401,
      // err: err,
      msg: `Invalid value ${err.value} for field: ${err.path}`,
    });
  }

  let statusCode = err.status || 500;
  let msg = err.msg || "Internal Server Error.";
  res.status(statusCode).json({ data: null, msg: msg, meta: null });
});

module.exports = app;
