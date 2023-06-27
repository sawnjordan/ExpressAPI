//functional based controller
// const registerUser = (req, res, next) => {
//   res.json({ msg: "This is POST request to register a user." });
// };
//file upload garna paryo vani form data use garna parhca postman ma
const { z } = require("zod");
const AuthService = require("./auth.service");

class AuthController {
  //yo chai constructor bata inject gareko authservice lai
  // constructor() {
  //   this.authService = new AuthService();
  // }
  constructor(svc) {
    this.authService = svc;
  }
  registerUser = async (req, res, next) => {
    //data
    //validation
    //custom validation, package

    //manipulation
    //client response
    try {
      let data = req.body;
      let validData = await this.authService.validateRegisterData(data);
      res.status(200).json({
        result: validData,
        msg: "Register successful.",
        meta: null,
      });
    } catch (error) {
      next(error);
    }

    // const { name, email, role } = req.body;

    // // res.json({
    // //   msg: "This is POST request to register a user.",
    // //   data,
    // //   cookie: req.cookies,
    // // });
  };

  verifyToken = (req, res, next) => {};

  passwordReset = (req, res, next) => {
    res.json({ msg: "This is POST request to reset the password." });
  };

  loginUser = (req, res, next) => {
    res.json({ msg: "This is POST request to login a user." });
  };

  viewProfile = (req, res, next) => {
    res.json({
      msg: "This is GET request to view logged in user profile information.",
    });
  };

  editProfile = (req, res, next) => {
    res.json({
      msg: "This is POST request to edit logged in user profile information.",
    });
  };

  logoutUser = (req, res, next) => {
    res.json({ msg: "This is POST request to logout." });
  };
}

module.exports = AuthController;
