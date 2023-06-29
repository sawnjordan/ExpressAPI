const nodemailer = require("nodemailer");
class MailService {
  connection;
  message;

  constructor() {
    try {
      this.connection = nodemailer.createTransport({
        host: process.env.SMTP_MAILTRAP_HOST,
        port: process.env.SMTP_MAILTRAP_PORT,
        auth: {
          user: process.env.SMTP_MAILTRAP_USERNAME,
          pass: process.env.SMTP_MAILTRAP_PASSWORD,
        },
      });
    } catch (error) {
      console.log(error);
      throw { status: 500, msg: "Error connecting SMTP Server." };
    }
  }

  setMessage = ({ to, cc = "", bcc = "", sub, msgBody, attachments = "" }) => {
    this.message = {
      to: to,
      from: "noreply@domain.com",
      subject: sub,
      html: msgBody,
      // text: "<b>Hello world?</b>",
    };
    if (cc) {
      this.message.cc = cc;
    }
    if (bcc) {
      this.message.bcc = bcc;
    }
    if (attachments) {
      this.message.attachments = attachments;
    }
  };

  sendEmail = async () => {
    try {
      let response = await this.connection.sendMail(this.message);
      return response;
    } catch (error) {
      console.log(error);
      throw { status: 500, msg: error };
    }
  };
}

module.exports = MailService;
