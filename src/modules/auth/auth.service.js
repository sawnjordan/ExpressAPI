const { z } = require("zod");
const MailService = require("../../../services/mail.service");
class AuthService {
  mailService;
  validateRegisterData = async (data) => {
    try {
      const validateSchema = z.object({
        //all properties are required by default
        name: z
          .string()
          .min(3, {
            message: "Name must be of atlest 3 characters.",
          })
          .nonempty(),
        email: z.string().email().nonempty(),
        address: z.string(),
        phone: z.string().min(7, {
          message: "The Phone number must contain atleast 7 numbers.",
        }),
        image: z.string().nullable(),
      });

      let response = validateSchema.parse(data);
      //   console.log(response);
      return response;
    } catch (error) {
      let errorBags = {};
      error.errors.map((item) => {
        errorBags[item.path[0]] = item.message;
      });
      throw { status: 400, msg: errorBags };
    }
  };

  sendActivationEmail = async (to, name, token) => {
    try {
      this.mailService = new MailService();
      let url = `http://localhost:3005/activate/${token}`;
      this.mailService.setMessage({
        to: to,
        sub: "Activate your Account!",
        msgBody: `<p><stong>Dear ${name} 🙂,</stong></p> Your account has been registered.
        <p>Please click the link below or copy and paste the URL on the browser to activate your account.</p>
        <a href="${url}">${url}</a>
        <br/>
  
        <p>Regards!!,</p>
        <p>System Admin,</p>
        <p><small>🙏Please donot reply to this email.🙏</small></p>`,
        // text: "<b>Hello world?</b>",
      });

      return await this.mailService.sendEmail();
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = AuthService;
