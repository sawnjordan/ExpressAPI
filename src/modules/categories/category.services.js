const CategoryModel = require("./category.model");
const { z } = require("zod");
class CategoryServices {
  getCount = async (filter = {}) => {
    try {
      return await CategoryModel.count(filter);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  listCategorys = async ({ perPage, page }) => {
    try {
      let skip = (page - 1) * perPage;

      let data = await CategoryModel.find()
        .sort({ _id: "desc" })
        .limit(perPage)
        .skip(skip);

      if (data) {
        return data;
      } else {
        throw { status: 404, msg: "No any category found." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  validateCategoryData = (data) => {
    try {
      const validateCategorySchema = z.object({
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
      let response = validateCategorySchema.parse(data);
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

  storeCategory = async (data) => {
    try {
      let category = new CategoryModel(data);
      return await category.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getCategoryById = async (id) => {
    try {
      let category = await CategoryModel.findById(id);
      if (!category) {
        throw { status: 400, msg: "Category doesn't exists." };
      }
      return category;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  updateCategory = async (id, data) => {
    try {
      return await CategoryModel.findByIdAndUpdate(id, { $set: data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteCategoryById = async (id) => {
    try {
      let response = await CategoryModel.findByIdAndDelete(id);
      if (!response) {
        throw { status: 404, msg: "Category not found or already deleted." };
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getCategoryByFilter = async (filter = {}) => {
    try {
      return await CategoryModel.find(filter).sort({ _id: "desc" }).limit(10);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
const categoryServiceObj = new CategoryServices();
module.exports = categoryServiceObj;
