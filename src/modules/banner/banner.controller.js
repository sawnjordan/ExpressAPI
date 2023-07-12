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
    try {
      let data = req.body;
      data.image = req.file?.filename;
      let createdBy = req.authUser._id;
      let validBannerData = await bannerServiceObj.validateBannerData(data);
      validBannerData.createdBy = createdBy;
      let newBanner = await bannerServiceObj.storeBanner(validBannerData);

      if (newBanner) {
        res.json({
          data: newBanner,
          status: true,
          msg: "Banner created successfully.",
          meta: null,
        });
      } else {
        throw { status: 400, msg: "Failed to create Banner." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  updateBanner = async (req, res, next) => {
    try {
      let bannerId = req.params.id;
      let banner = await bannerServiceObj.getBannerById(bannerId);
      let data = req.body;
      if (req.file) {
        data.image = req.file.filename;
      } else {
        data.image = banner.image;
      }
      // console.log(data);
      let validBannerData = await bannerServiceObj.validateBannerData(data);

      let updatedBanner = await bannerServiceObj.updateBanner(
        bannerId,
        validBannerData
      );

      if (updatedBanner) {
        res.json({
          data: updatedBanner,
          status: true,
          msg: "Banner Updated successfully.",
          meta: null,
        });
      } else {
        throw { status: 400, msg: "Failed to create Banner." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

const bannerControllerObj = new BannerController();
module.exports = bannerControllerObj;
