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
}
const brandControllerObj = new BrandController();
module.exports = brandControllerObj;
