//functional based controller
// const registerUser = (req, res, next) => {
//   res.json({ msg: "This is POST request to register a user." });
// };
//file upload garna paryo vani form data use garna parhca postman ma
const { z } = require("zod");
const AuthService = require("./auth.service");
const userModel = require("./user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PersonalAccessTokenModel = require("./access.token.model");
const { generateRandomStrings } = require("../../utilities/helpers");
const patServiceObj = require("./personal-access-token-services");

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
        data: newUser,
        status: true,
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
            msg: "Password must be of atleast 8 characters and should match Re-password.",
          };
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        // console.log(hashedPassword);
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
          msg: "User has been activated successfully.",
          meta: null,
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  loginUser = async (req, res, next) => {
    try {
      let { email, password } = req.body;
      // console.log(email, password);
      if (!email || !password) {
        throw { status: 400, msg: "Credentials Required." };
      }
      let user = await this.authService.getUserByFilter({ email });

      if (!user || user.length === 0) {
        throw { status: 404, msg: "User doesn't exists." };
      } else {
        user = user[0];
        if (bcrypt.compareSync(password, user.password)) {
          if (user.status === "active") {
            let accessToken = jwt.sign(
              { id: user._id },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "2h",
              }
            );
            let refreshToken = jwt.sign(
              { id: user._id },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "7d",
              }
            );

            let patData = {
              userId: user._id,
              accessToken,
              refreshToken,
            };

            // let personalAccessToken = await new PersonalAccessTokenModel(
            //   patData
            // ).save();
            // console.log(personalAccessToken);

            let storedPat = await patServiceObj.storeInDB(patData);
            // console.log(storedPat);

            // user = await this.authService.getUserByFilter(
            //   { email },
            //   "-password"
            // );
            // console.log("first", user);
            // delete user.password;
            // console.log("second", user);
            res.json({
              data: {
                accessToken,
                refreshToken,
                userDetails: {
                  id: user._id,
                  name: user?.name,
                  role: user?.role,
                },
              },
              status: true,
              msg: "You are logged in.",
              meta: null,
            });
          } else {
            next({ staus: 422, msg: "User not activated or is suspended." });
          }
        } else {
          next({ status: 422, msg: "Credentials doesn't match." });
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getLoggedInUserProfile = (req, res, next) => {
    try {
      res.json({
        data: req.authUser,
        status: true,
        msg: "Your Profile",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  editProfile = (req, res, next) => {
    res.json({
      msg: "This is POST request to edit logged in user profile information.",
    });
  };

  logoutUser = async (req, res, next) => {
    try {
      let token = req.headers["authorization"];
      token = token.split(" ")[1];
      let deletePat = await patServiceObj.deletePAT(token);
      res.json({
        status: true,
        data: deletePat,
        msg: "Successfully logged out.",
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      // console.log(req);
      let id = req.authUser.id;
      const authUser = req.authUser;
      let accessToken = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "2h",
      });
      let refreshToken = req.headers["authorization"].split(" ").pop();
      // console.log(refreshToken);
      let patDataToUpdate = {
        userId: id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      // console.log(patDataToUpdate);
      let patData = await patServiceObj.getPATFromToken(refreshToken);
      // console.log(patData);
      let patResponse = await patServiceObj.updateAccessToken(
        patDataToUpdate,
        patData._id
      );
      // console.log(patResponse);
      res.json({
        data: {
          accessToken: patResponse.accessToken,
          refreshToken: patResponse.refreshToken,
          userDetails: {
            id: authUser._id,
            name: authUser.name,
            role: authUser.role,
          },
        },
        status: true,
        msg: "Token Refreshed.",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = AuthController;
