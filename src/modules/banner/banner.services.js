const BannerModel = require("./banner.model");

class BannerServices {
  listBanners = async () => {
    try {
      let data = await BannerModel.find();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
const bannerServiceObj = new BannerServices();
module.exports = bannerServiceObj;
