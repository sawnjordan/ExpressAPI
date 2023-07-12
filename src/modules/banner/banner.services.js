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

        status: z.string().nonempty(),
        link: z.string().url().nullable(),
        image: z.string().nonempty(),
      });
      let response = validateBannerSchema.parse(data);
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

  storeBanner = async (data) => {
    try {
      let banner = new BannerModel(data);
      return await banner.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getBannerById = async (id) => {
    try {
      let banner = await BannerModel.findById(id);
      if (!banner) {
        throw { status: 400, msg: "Banner doesn't exists." };
      }
      return banner;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updateBanner = async (id, data) => {
    try {
      return await BannerModel.findByIdAndUpdate(id, { $set: data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteBannerById = async (id) => {
    try {
      let response = await BannerModel.findByIdAndDelete(id);
      if (!response) {
        throw { status: 404, msg: "Banner not found or already deleted." };
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getBannerByFilter = async (filter = {}) => {
    try {
      return await BannerModel.find(filter).sort({ _id: "desc" }).limit(10);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
const bannerServiceObj = new BannerServices();
module.exports = bannerServiceObj;
