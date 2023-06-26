const express = require("express");
const router = require("../routes");
const app = express();

//if your content type is application/json us this middleware
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", router);

//this is express global error handling middleware. The first parameter is always err.
app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  let msg = err.msg || "Internal Server Error.";
  res.status(statusCode).json({ msg: msg });
});

module.exports = app;
