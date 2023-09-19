const productServiceObj = require("../products/products.services");
const CategoryModel = require("./category.model");
const categoryServiceObj = require("./category.services");
const slugify = require("slugify");
const mongoose = require("mongoose");
class CategoryController {
  getAllCategories = async (req, res, next) => {
    try {
      let pagination = {
        perPage: parseInt(req.query.perPage) ?? 10,
        page: parseInt(req.query.page) ?? 1,
      };
      let data = await categoryServiceObj.listCategories(pagination);
      let categoryCount = await categoryServiceObj.getCount();
      res.json({
        data: data,
        status: true,
        msg: "",
        meta: {
          totalCount: categoryCount,
          ...pagination,
        },
      });
    } catch (error) {
      console.log(error);
      next({
        status: 400,
        msg: error.message ?? "Error fetching category data.",
      });
    }
  };

  getCategoryForHomePage = async (req, res, next) => {
    try {
      let data = await categoryServiceObj.getCategoryByFilter({
        status: "active",
      });
      res.json({
        data: data,
        status: true,
        msg: "Category Fetched.",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next({
        status: 400,
        msg: error.message ?? "Error fetching category data.",
      });
    }
  };

  createCategory = async (req, res, next) => {
    try {
      let data = req.body;
      if (req.file) {
        data.image = req.file.filename;
      }
      let createdBy = req.authUser._id;
      if (!data.parent || data.parent === "null" || data.parent === null) {
        data.parent = null;
      }
      let validCategoryData = categoryServiceObj.validateCategoryData(data);
      validCategoryData.createdBy = createdBy;
      //slugify the name
      validCategoryData.slug = slugify(validCategoryData.name, {
        lower: true,
      });
      let newCategory = await categoryServiceObj.storeCategory(
        validCategoryData
      );

      if (newCategory) {
        res.json({
          data: newCategory,
          status: true,
          msg: "Category created successfully.",
          meta: null,
        });
      } else {
        throw { status: 400, msg: "Failed to create Category." };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  updateCategory = async (req, res, next) => {
    try {
      let categoryId = req.params.id;
      let category = await categoryServiceObj.getCategoryById(categoryId);
      let data = req.body;
      if (req.file) {
        data.image = req.file.filename;
      } else {
        data.image = category.image;
      }

      if (!data.parent || data.parent === "null" || data.parent === null) {
        data.parent = null;
      }
      // console.log(data);
      let validCategoryData = categoryServiceObj.validateCategoryData(data);

      let updatedCategory = await categoryServiceObj.updateCategory(
        categoryId,
        validCategoryData
      );

      if (updatedCategory) {
        res.json({
          data: updatedCategory,
          status: true,
          msg: "Category Updated successfully.",
          meta: null,
        });
      } else {
        throw { status: 400, msg: "Failed to update a Category." };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  deleteCategory = async (req, res, next) => {
    try {
      let categoryId = req.params.id;
      let del = await categoryServiceObj.deleteCategoryById(categoryId);
      res.json({
        data: del,
        status: true,
        msg: "Category Deleted Successfully",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getCategoryById = async (req, res, next) => {
    try {
      let categoryId = req.params.id;
      let cat = await categoryServiceObj.getCategoryById(categoryId);
      res.json({
        data: cat,
        status: true,
        msg: "Category Fetched Successfully",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getProductWithSlug = async (req, res, next) => {
    try {
      let categorySlug = req.params.categorySlug;
      let catdata = await categoryServiceObj.getCategoryByFilter({
        slug: categorySlug,
      });
      // console.log(catdata[0].name);
      if (catdata.length === 0) {
        return res
          .status(404)
          .json({ success: true, msg: "Category Not Found" });
      }
      let catId = catdata[0]._id;
      let products = await productServiceObj.getProductByFilter({
        categories: new mongoose.Types.ObjectId(catId),
      });

      if (products.length === 0) {
        return res
          .status(404)
          .json({ success: true, msg: "Products not found." });
      }
      // console.log(products);
      res.json({
        data: { products, catName: catdata[0].name },
        status: true,
        msg: "Products Fetched Successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
    }
  };
}

const categoryControllerObj = new CategoryController();
module.exports = categoryControllerObj;
