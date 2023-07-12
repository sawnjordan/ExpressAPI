const { z } = require("zod");
const BrandModel = require("./brands.model");
class BrandServices {
  validateBrandData = (data) => {
    try {
      if (typeof data.logo === "undefined") {
        // console.log("hsdfasd");
        data.logo = null;
      }
      const validateBrandSchema = z.object({
        //all properties are required by default
        name: z
          .string()
          .min(2, {
            message: "Name must be of atlest 3 characters.",
          })
          .nonempty(),

        status: z.string().nonempty(),
        slug: z.string().nonempty(),
        logo: z.string().nullable(),
      });
      let response = validateBrandSchema.parse(data);
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error);
      let errorBags = {};
      error.errors.map((item) => {
        errorBags[item.path[0]] = item.message;
      });
      throw { status: 400, msg: errorBags };
    }
  };

  createBrand = async (data) => {
    try {
      let brand = new BrandModel(data);
      return await brand.save();
    } catch (error) {
      //   console.log("askldfsadflkjl");
      console.log(error);
      throw error;
    }
  };
}

const brandServiceObj = new BrandServices();
module.exports = brandServiceObj;
