//functional based controller
// const registerUser = (req, res, next) => {
//   res.json({ msg: "This is POST request to register a user." });
// };
//file upload garna paryo vani form data use garna parhca postman ma
const { z } = require("zod");
const AuthService = require("./auth.service");
const userModel = require("./user.model");
const bcrypt = require("bcryptjs");

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
      // console.log(validData);

      let activationToken = generateRandomStrings(100);
      validData.activationToken = activationToken;
      //manipulation

      // const response = await db.collection("users").insertOne(validData);
      // console.log(validData);
      const newUser = await this.authService.registerUserData(validData);
      // console.log(newUser);

      let sendMailSuccess = await this.authService.sendActivationEmail(
        newUser.email,
        newUser.name,
        activationToken
      );

      //data.email ma email pathaidina paryo

      res.status(200).json({
        result: newUser,
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

  verifyToken = async (req, res, next) => {
    try {
      const token = req.params.token;
      console.log(token);
      const user = await this.authService.getUserByToken(token);
      if (!user) {
        next({ status: 400, msg: "Token broken / User alreaedy activated." });
      } else {
        res.status(200).json({
          data: user,
          status: true,
          msg: "Token Verified and ready for activation.",
          meta: null,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  setPassword = async (req, res, next) => {
    try {
      const activationToken = req.params.token;
      const user = await this.authService.getUserByToken(activationToken);
      if (!user) {
        throw { status: 404, msg: "User Doesn't exists." };
      } else {
        const { password, confirmPassword } = req.body;
        if (!password || password !== confirmPassword || password.length < 8) {
          throw {
            status: 400,
            msg: "Password must be of atlease 8 characters and should match Re-password",
          };
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        console.log(hashedPassword);
        let userBeforeUpdate = await this.authService.updateUser(
          {
            password: hashedPassword,
            activationToken: null,
            status: "active",
          },
          user._id
        );
        res.json({
          status: true,
          data: userBeforeUpdate,
          msg: "User has been activated successfully",
          meta: null,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
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
