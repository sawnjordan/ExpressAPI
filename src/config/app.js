const express = require("express");
const router = require("../routes");
const app = express();

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  let statusCode = err.status || 500;
  let msg = err.msg || "Internal Server Error.";
  res.status(statusCode).json({ msg: msg });
});

module.exports = app;
