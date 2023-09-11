const { z } = require("zod");
const MailService = require("../../services/mail.service");
const UserModel = require("./user.model");
class AuthService {
  mailService;
  validateRegisterData = async (data) => {
    try {
      if (typeof data.address === "string") {
        data.address = JSON.parse(data.address);
      }
      const validateSchema = z.object({
        //all properties are required by default
        name: z
          .string()
          .min(3, {
            message: "Name must be of atlest 3 characters.",
          })
          .nonempty(),
        email: z.string().email().nonempty(),
        address: z.object({
          shippingAddress: z.string().nullable(),
          billingAddress: z.string().nullable(),
        }),
        phone: z.string().min(7, {
          message: "The Phone number must contain atleast 7 numbers.",
        }),
        image: z.string().nullable(),
        role: z
          .string()
          .regex(/seller|customer/)
          .nonempty(),
      });
      let response = validateSchema.parse(data);
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
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
      let url = `http://localhost:5173/activate/${token}`;
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

  registerUserData = async (data) => {
    try {
      const newUser = new UserModel(data);
      return await newUser.save();
    } catch (error) {
      console.log(error);
      throw { status: 500, msg: "Error Processing the query." };
    }
  };
  getUserByToken = async (activationToken) => {
    try {
      const user = UserModel.findOne({
        $and: [
          { activationToken: activationToken },
          { activationToken: { $ne: null } },
        ],
      });
      return user;
    } catch (error) {
      console.log(error);
      throw { status: 500, msg: "Error fetching data." };
    }
  };

  updateUser = async (userData, userId) => {
    try {
      let prevUser = UserModel.findByIdAndUpdate(userId, { $set: userData });
      return prevUser;
    } catch (error) {
      console.log(error);
      throw { status: 422, msg: "Update failed." };
    }
  };
  getUserByFilter = async (filter = {}, excludeFields = "") => {
    try {
      let user = await UserModel.find(filter, excludeFields);
      return user;
    } catch (error) {
      console.log(error);
      throw { status: 422, msg: "User Fetch error." };
    }
  };

  getUserById = async (userId) => {
    try {
      let user = await UserModel.findById(userId, { password: 0 });
      if (!user) {
        throw { status: 404, msg: "User doesn't exists." };
      } else {
        return user;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
module.exports = AuthService;
