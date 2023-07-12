const bannerServiceObj = require("./banner.services");

class BannerController {
  getAllBanners = async (req, res, next) => {
    try {
      let pagination = {
        perPage: parseInt(req.query.perPage) ?? 10,
        page: parseInt(req.query.page) ?? 1,
      };
      let data = await bannerServiceObj.listBanners(pagination);
      let banenrCount = bannerServiceObj.getCount();
      res.json({
        data: data,
        status: true,
        msg: "",
        meta: {
          totalCount: banenrCount,
          ...pagination,
        },
      });
    } catch (error) {
      console.log(error);
      next({
        status: 400,
        msg: error.message ?? "Error fetching banner data.",
      });
    }
  };

  createBanner = async (req, res, next) => {
    let data = req.body;
    data.image = req.file.filename;
    let validData = await bannerServiceObj.validateBannerData(data);
    try {
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

const bannerControllerObj = new BannerController();
module.exports = bannerControllerObj;
