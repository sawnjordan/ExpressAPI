const { z } = require("zod");
class AuthService {
  validateRegisterData = async (data) => {
    try {
      const validateSchema = z.object({
        name: z
          .string()
          .min(3, {
            message: "Name must be of atlest 3 characters.",
          })
          .nonempty(),
        email: z.string().email().nonempty(),
        address: z.string(),
        phone: z.string().nullable(), //this allows to have null value, by default nullable huncha
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
}
module.exports = AuthService;
