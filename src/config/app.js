const express = require("express");
const router = require("../routes");
const app = express();

app.use("/api/v1", router);

module.exports = app;
