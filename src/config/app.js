const express = require("express");

const app = express();

app.post("/register", (request, response) => {
  //Business Logic

  response.status(200).json({ msg: "User has been registered successfully" });
});

app.post("/login", (req, res) => {
  //login process
  res.json({ msg: "Login Successful" });
});

module.exports = app;
