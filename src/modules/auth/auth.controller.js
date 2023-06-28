//functional based controller
// const registerUser = (req, res, next) => {
//   res.json({ msg: "This is POST request to register a user." });
// };
//file upload garna paryo vani form data use garna parhca postman ma
const { z } = require("zod");
const AuthService = require("./auth.service");
const { generateRandomStrings } = require("../../utilities/helpers");
const nodemailer = require("nodemailer");

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

      //manipulation

      let activateToken = generateRandomStrings(100);

      let url = `http://localhost:3005/activate/${activateToken}`;
      //data.email ma email pathaidina paryo
      const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });

      let sendMailSuccess = await transport.sendMail({
        from: "noreply@domain.com", // sender address
        to: data.email, // list of receivers
        subject: "Activate your Account!", // Subject line
        html: `<p><stong>Dear ${data.name} 🙂,</stong></p> Your account has been registered.
        <p>Please click the link below or copy and paste the URL on the browser to activate your account.</p>
        <a href="${url}">${url}</a>
        <br/>

        <p>Regards!!,</p>
        <p>System Admin,</p>
        <p><small>🙏Please donot reply to this email.🙏</small></p>`,
        // text: "<b>Hello world?</b>",
      });
      //client response
      // console.log(sendMailSuccess);
      res.status(200).json({
        result: validData,
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
