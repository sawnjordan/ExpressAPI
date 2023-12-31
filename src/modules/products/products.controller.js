const productServiceObj = require("./products.services");
const ProductStoreTransformer = require("./product.transform");
const { default: slugify } = require("slugify");
const path = require("path");
const fs = require("fs");
// const { error } = require("console");

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
      let slug = slugify(validProductData.name, {
        lower: true,
        remove: /[*+~.()'"!:@]/g,
      });

      await productServiceObj.getUniqueSlug(slug);
      validProductData.slug = productServiceObj._slug;
      // console.log(validProductData);
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

  getSearchResult = async (req, res, next) => {
    try {
      let keyword = req.query?.keyword;
      // console.log(keyword);

      if (keyword === undefined) {
        return res.status(404).json({
          status: false,
          msg: "Query string doesn't match.",
        });
      }

      let productResults = await productServiceObj.getProductByFilter({
        name: new RegExp(keyword, "i"),
      });
      res.json({
        data: productResults,
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
      // console.log(req.originalUrl);
      let dir = "./public/annon";
      const originalURL = req.originalUrl;
      // console.log(typeof originalURL);
      if (originalURL.includes("/products/")) {
        dir = "./public/uploads/products";
      } else if (originalURL.includes("/brands/")) {
        dir = "./public/uploads/brands";
      } else if (originalURL.includes("/category/")) {
        dir = "./public/uploads/category";
      } else if (originalURL.includes("/user/")) {
        dir = "./public/uploads/users";
      } else if (originalURL.includes("/banner/")) {
        dir = "./public/uploads/banner";
      }
      // console.log(dir);
      let imgName = req.params.imgName;
      const imgPath = path.join(dir, imgName);
      if (fs.existsSync(imgPath)) {
        fs.unlink(imgPath, (err) => {
          if (err) {
            console.log(error);
            next(err);
          } else {
          }
        });
      } else {
        console.log("Image not found!!");
      }

      let productId = req.params.productId;

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

  getProductBySlug = async (req, res, next) => {
    try {
      let productSlug = req.params.productSlug;
      let productData = await productServiceObj.getProductByFilter({
        slug: productSlug,
      });
      // console.log(productData[0].name);
      if (productData.length === 0) {
        return res
          .status(404)
          .json({ success: true, msg: "Product detail Not Found" });
      }
      let productId = productData[0]._id;
      let product = await productServiceObj.getProductById(productId);
      // console.log(product);

      if (!product) {
        return res
          .status(404)
          .json({ success: true, msg: "Products not found." });
      }
      res.json({
        data: product,
        status: true,
        msg: "Product Fetched Successfully",
        meta: null,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getCartDetails = async (req, res, next) => {
    try {
      let cartItems = req.body;
      if (!cartItems) {
        next({ status: 400, msg: "Your cart is empty!" });
      } else {
        // console.log(cartItems);
        let cartDetails = [];
        let formattedData = {
          details: null,
          subTotal: 0,
          discount: 0,
          tax: 0,
          totalAmt: 0,
          shippingFee: 0,
        };
        let productIds = cartItems.map((item) => {
          return item.productId;
        });
        // console.log(productIds);

        let productDetails = await productServiceObj.getProductByFilter({
          _id: { $in: productIds },
        });

        productDetails.map((item) => {
          let singleItem = {
            id: item._id,
            name: item.name,
            image: item.images[0],
            price: item?.afterDiscount ?? item.price,
            prodDis: item.discount ?? 0,
            stock: item?.stock,
            qty: 0,
            amt: 0,
          };
          let qty = null;
          cartItems.map((cart) => {
            if (item._id.equals(cart.productId)) {
              qty = cart.qty;
            }
            singleItem.qty = qty;
          });
          singleItem.amt = singleItem.qty * singleItem.price;
          cartDetails.push(singleItem);
          formattedData.subTotal += singleItem.amt;
          singleItem.price = item.price;
          singleItem.afterDiscount = item?.afterDiscount ?? null;
        });
        // console.log(cartDetails);
        formattedData.subTotal = Number(formattedData.subTotal.toFixed(2));
        formattedData.details = cartDetails;
        formattedData.totalAmt =
          formattedData.subTotal -
          formattedData.discount +
          (formattedData.subTotal - formattedData.discount) * 0.13;
        formattedData.tax = Number(
          (formattedData.subTotal - formattedData.discount) * 0.13
        ).toFixed(2);
        formattedData.totalAmt = Number(formattedData.totalAmt.toFixed(2));

        if (formattedData.totalAmt <= 200000) {
          formattedData.shippingFee = Number(0.01 * formattedData.totalAmt);
        } else {
          formattedData.shippingFee = 0;
        }

        res.json({
          data: formattedData,
          status: true,
          msg: "Cart Details",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
const productControllerObj = new ProductController();
module.exports = productControllerObj;
