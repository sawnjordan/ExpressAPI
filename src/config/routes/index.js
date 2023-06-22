// const express = require("express");
// const router = express.Router(); //Provides us a middleware capable enough to handle all routing

const router = require("express").Router(); //mathi ko two line of code is same as this line of code

//TODO: Route mount

module.exports = router;

router.use((req, res, next) => {
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

router.post("/register", (request, response, next) => {
  //Business Logic

  response.status(200).json({ msg: "User has been registered successfully" });
});

router.post("/me", authCheck, (request, response, next) => {
  //Business Logic

  response.status(200).json({ msg: "User has been registered successfully" });
});

router.post("/login", loginMiddleware, (request, response, next) => {
  //login process
  response.json({ msg: "Login Successful" });
});
