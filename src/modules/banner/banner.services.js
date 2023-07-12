const BannerModel = require("./banner.model");
const { z } = require("zod");
class BannerServices {
  getCount = async (filter = {}) => {
    try {
      return await BannerModel.count(filter);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  listBanners = async ({ perPage, page }) => {
    try {
      let skip = (page - 1) * perPage;

      let data = await BannerModel.find()
        .sort({ _id: "desc" })
        .limit(perPage)
        .skip(skip);

      if (data) {
        return data;
      } else {
        throw { status: "Not Found.", msg: "No any banner found." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  validateBannerData = (data) => {
    try {
      const validateBannerSchema = z.object({
        //all properties are required by default
        title: z
          .string()
          .min(3, {
            message: "Title must be of atlest 3 characters.",
          })
          .nonempty(),

        image: z.string().nullable(),
        link: z.string().url(),
      });
      let response = validateBannerSchema.parse(data);
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
}
const bannerServiceObj = new BannerServices();
module.exports = bannerServiceObj;
