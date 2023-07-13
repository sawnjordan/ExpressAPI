const CategoryModel = require("./category.model");
const categoryServiceObj = require("./category.services");

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
      data.image = req.file?.filename;
      let createdBy = req.authUser._id;
      let validCategoryData = categoryServiceObj.validateCategoryData(data);
      validCategoryData.createdBy = createdBy;
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
}

const categoryControllerObj = new CategoryController();
module.exports = categoryControllerObj;
