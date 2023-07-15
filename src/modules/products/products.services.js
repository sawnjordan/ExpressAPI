const { z } = require("zod");
const ProductModel = require("./products.model");
const { default: slugify } = require("slugify");

class ProductServices {
  _slug;
  getCount = async () => {
    try {
      return await ProductModel.count();
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  validateProductData = (data) => {
    try {
      // if (typeof data.logo === "undefined") {
      //   // console.log("hsdfasd");
      //   data.logo = null;
      // }
      const validateProductSchema = z.object({
        //all properties are required by default
        name: z
          .string()
          .min(2, {
            message: "Name must be of atlest 3 characters.",
          })
          .nonempty(),
        categories: z.array(z.string()).nonempty(),
        description: z.string().nonempty(),
        costPrice: z.number().nonnegative(),
        price: z.number().nonnegative().min(1).nonnegative(),
        discount: z.number().nonnegative().min(0).max(100).nonnegative(),
        brand: z.string().nullable(),
        status: z.string().nonempty(),
        images: z.array(z.string()).nullable(),
        sellerId: z.string().nullable(),
      });
      let response = validateProductSchema.parse(data);
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

  createProduct = async (data) => {
    try {
      let product = new ProductModel(data);
      return await product.save();
    } catch (error) {
      //   console.log("askldfsadflkjl");
      console.log(error);
      throw error;
    }
  };
  updateProduct = async (id, data) => {
    try {
      return await ProductModel.findByIdAndUpdate(id, { $set: data });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  deleteProductById = async (id) => {
    try {
      let response = await ProductModel.findByIdAndDelete(id);
      if (!response) {
        throw { status: 400, msg: "Product not found or already delete." };
      }
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  listProducts = async ({ perPage = 10, page = 1 }) => {
    try {
      let skip = (page - 1) * perPage;
      let data = await ProductModel.find()
        .populate("categories")
        .populate("brand")
        .populate("sellerId")
        .sort({ _id: "desc" })
        .limit(perPage)
        .skip(skip);
      if (data) {
        return data;
      } else {
        throw { status: 404, msg: "No any product found." };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getProductById = async (id) => {
    try {
      let product = await ProductModel.findById(id)
        .populate("categories")
        .populate("brand")
        .populate("sellerId");
      if (!product) {
        throw { status: 404, msg: "Product doesn't exists." };
      }
      return product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getProductByFilter = async (filter = {}) => {
    try {
      return await ProductModel.find(filter)
        .populate("categories")
        .populate("brand")
        .populate("sellerId")
        .sort({ _id: "desc" })
        .limit(10);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getUniqueSlug = async (slug) => {
    let product = await this.getProductByFilter({ slug });
    if (product.length) {
      slug += "-" + Date.now();
      await this.getUniqueSlug(slug);
    } else {
      this._slug = slug;
    }
  };
}

const productServiceObj = new ProductServices();
module.exports = productServiceObj;
