const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("I am always called");
  next();
});

const authCheck = (req, res, next) => {
  console.log("I am only called on /me router");
  next();
};

const loginMiddleware = (request, response, next) => {
  console.log("I am called on the /login route");
  next();
};

app.post("/register", (request, response, next) => {
  //Business Logic

  response.status(200).json({ msg: "User has been registered successfully" });
});

app.post("/me", authCheck, (request, response, next) => {
  //Business Logic

  response.status(200).json({ msg: "User has been registered successfully" });
});

app.post("/login", loginMiddleware, (request, response, next) => {
  //login process
  response.json({ msg: "Login Successful" });
});

module.exports = app;
