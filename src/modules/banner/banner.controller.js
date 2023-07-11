const BannerModel = require("./banner.model");
const bannerServiceObj = require("./banner.services");

class BannerController {
  getAllBanners = async (req, res, next) => {
    try {
      let data = await bannerServiceObj.listBanners();
      res.json({ data: "Banner Fetched", status: true, msg: "Here" });
    } catch (error) {
      console.log(error);
      next({
        status: 400,
        msg: error.message ?? "Error fetching banner data.",
      });
    }
  };
}

const bannerControllerObj = new BannerController();
module.exports = bannerControllerObj;
