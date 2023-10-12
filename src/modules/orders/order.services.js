const { z } = require("zod");
const OrderModel = require("./orders.model");
const ProductModel = require("../products/products.model");

class OrderServices {
  updateStock = async (productId, productQuantity) => {
    const product = await ProductModel.findById(productId);
    product.stock = product.stock - productQuantity;

    await product.save();
  };

  updateCancelledStock = async (productId, productQuantity) => {
    const product = await ProductModel.findById(productId);
    product.stock = product.stock + productQuantity;

    await product.save();
  };
}

const orderServiceObj = new OrderServices();
module.exports = orderServiceObj;
