const bannerServiceObj = require("../banner/banner.services");
const BrandModel = require("./brands.model");
const brandServiceObj = require("./brands.services");

class BrandController {
  createBrand = async (req, res, next) => {
    try {
      let brandData = req.body;
      let { brandSlug } = req.body;
      //   let isSlugExists = await brandServiceObj.checkIfSlugExists(brandSlug);
      brandData.logo = req.file?.filename;
      //   console.log(brandData);
      let createdBy = req.authUser._id;
      let validBrandData = brandServiceObj.validateBrandData(brandData);
      validBrandData.createdBy = createdBy;
      //   console.log(validBrandData);
      let newBrand = await brandServiceObj.createBrand(validBrandData);
      if (!newBrand) {
        throw { status: 500, msg: "Error while creating brand." };
      }

      res.status(201).json({
        data: newBrand,
        status: true,
        msg: "Brand Created Successfully.",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getAllBrands = async (req, res, next) => {
    try {
      let { perPage, page } = req.query;
      let pagination = { perPage: parseInt(perPage), page: parseInt(page) };
      let data = await brandServiceObj.listBrands(pagination);
      let brandCount = await brandServiceObj.getCount();
      res.json({
        data: data,
        status: true,
        msg: "",
        meta: {
          totalCount: brandCount,
          ...pagination,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  updateBrand = async (req, res, next) => {
    try {
      let brandId = req.params.id;
      let brand = await brandServiceObj.getBrandById(brandId);
      let data = req.body;
      if (req.file) {
        data.logo = req.file.filename;
      } else {
        data.logo = brand.logo;
      }

      let validBrandData = brandServiceObj.validateBrandData(data);
      let updatedBrand = await brandServiceObj.updateBrand(
        brandId,
        validBrandData
      );

      if (updatedBrand) {
        res.json({
          data: updatedBrand,
          status: true,
          msg: "Brand Updated Successfully.",
          meta: null,
        });
      } else {
        throw { status: 400, msg: "Failed to update a brand." };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
const brandControllerObj = new BrandController();
module.exports = brandControllerObj;
