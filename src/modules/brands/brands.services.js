const { z } = require("zod");
const BrandModel = require("./brands.model");
class BrandServices {
  getCount = async () => {
    try {
      return await BrandModel.count();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
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
  updateBrand = async (id, data) => {
    try {
      return await BrandModel.findByIdAndUpdate(id, { $set: data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  deleteBrandById = async (id) => {
    try {
      let response = await BrandModel.findByIdAndDelete(id);
      if (!response) {
        throw { status: 400, msg: "Brand not found or already delete." };
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  listBrands = async ({ perPage = 10, page = 1 }) => {
    try {
      let skip = (page - 1) * perPage;
      let data = await BrandModel.find()
        .sort({ _id: "desc" })
        .limit(perPage)
        .skip(skip);
      if (data) {
        return data;
      } else {
        throw { status: 404, msg: "No any brand found." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getBrandById = async (id) => {
    try {
      let brand = await BrandModel.findById(id);
      if (!brand) {
        throw { status: 404, msg: "Brand doesn't exists." };
      }
      return brand;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

const brandServiceObj = new BrandServices();
module.exports = brandServiceObj;
