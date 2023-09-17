const productServiceObj = require("./products.services");
const ProductStoreTransformer = require("./product.transform");
const { default: slugify } = require("slugify");

class ProductController {
  getProductForHomePage = async (req, res, next) => {
    try {
      let data = await productServiceObj.getProductByFilter({
        status: "active",
      });
      res.json({
        data: data,
        status: true,
        msg: "Product Fetched.",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next({
        status: 400,
        msg: error.message ?? "Error fetching product data.",
      });
    }
  };
  createProduct = async (req, res, next) => {
    try {
      let productData = new ProductStoreTransformer(req).transformData();
      // console.log(productData);
      let createdBy = req.authUser._id;
      let validProductData = productServiceObj.validateProductData(productData);
      productData.afterDiscount =
        productData.price - (productData.price * productData.discount) / 100;
      validProductData.createdBy = createdBy;

      //slugify the name
      let slug = slugify(validProductData.name, { lower: true });

      await productServiceObj.getUniqueSlug(slug);
      validProductData.slug = productServiceObj._slug;
      console.log(validProductData);
      // console.log(productServiceObj);

      let newProduct = await productServiceObj.createProduct(validProductData);
      if (!newProduct) {
        throw { status: 500, msg: "Error while creating product." };
      }

      res.status(201).json({
        data: newProduct,
        status: true,
        msg: "Product Created Successfully.",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getAllProducts = async (req, res, next) => {
    try {
      let { perPage, page } = req.query;
      let pagination = { perPage: parseInt(perPage), page: parseInt(page) };
      let data = await productServiceObj.listProducts(pagination);
      let productCount = await productServiceObj.getCount();
      res.json({
        data: data,
        status: true,
        msg: "Products Fetched.",
        meta: {
          totalCount: productCount,
          ...pagination,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getProductById = async (req, res, next) => {
    try {
      let id = req.params.id;
      let product = await productServiceObj.getProductById(id);
      res.json({
        data: product,
        status: true,
        msg: "Product Fetched.",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      let productData = new ProductStoreTransformer(req).transformData();
      let productId = req.params.id;
      let product = await productServiceObj.getProductById(productId);
      if (productData.images.length === 0) {
        productData.images = product.images;
      }

      let validProductData = productServiceObj.validateProductData(productData);
      let updatedProduct = await productServiceObj.updateProduct(
        productId,
        validProductData
      );

      if (updatedProduct) {
        res.json({
          data: updatedProduct,
          status: true,
          msg: "Product Updated Successfully.",
          meta: null,
        });
      } else {
        throw { status: 400, msg: "Failed to update a product." };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      let del = await productServiceObj.deleteProductById(productId);
      res.json({
        data: del,
        status: true,
        msg: "Product Deleted Successfully",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteImage = async (req, res, next) => {
    try {
      let productId = req.params.productId;
      let imgName = req.params.imgName;

      let productDetails = await productServiceObj.getProductById(productId);
      let images = productDetails.images;
      let updatedImage = images.filter((img) => img !== imgName);
      productDetails.images = updatedImage;
      await productDetails.save();
      res.json({
        status: true,
        msg: "Image deleted.",
        data: productDetails,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
const productControllerObj = new ProductController();
module.exports = productControllerObj;
