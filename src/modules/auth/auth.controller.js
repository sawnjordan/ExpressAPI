//functional based controller
// const registerUser = (req, res, next) => {
//   res.json({ msg: "This is POST request to register a user." });
// };
//file upload garna paryo vani form data use garna parhca postman ma
const { z } = require("zod");
const AuthService = require("./auth.service");
const { generateRandomStrings } = require("../../utilities/helpers");
// const nodemailer = require("nodemailer");
// const { MongoClient } = require("mongodb");
const userModel = require("./user.model");

class AuthController {
  //yo chai constructor bata inject gareko authservice lai
  // constructor() {
  //   this.authService = new AuthService();
  // }

  constructor(svc) {
    this.authService = svc;
  }
  registerUser = async (req, res, next) => {
    try {
      //data
      //custom validation, package

      let data = req.body;
      data.image = req.file.filename;

      //validation

      let validData = await this.authService.validateRegisterData(data);

      let activateToken = generateRandomStrings(100);
      validData.activateToken = activateToken;
      //manipulation

      //DB connection and store in DB
      // const connection = await MongoClient.connect(process.env.MONGODB_URL);
      // const db = connection.db(process.env.MONGODB_NAME);

      // const response = await db.collection("users").insertOne(validData);

      let newUser = new userModel(validData);

      // let sendMailSuccess = await this.authService.sendActivationEmail(
      //   data.email,
      //   data.name,
      //   activateToken
      // );

      //data.email ma email pathaidina paryo

      res.status(200).json({
        result: response,
        msg: "Register successful.",
        meta: {
          emailStatus: "Success",
          emailMessageId: sendMailSuccess.messageId,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
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
