const { default: mongoose } = require("mongoose");
const OrderModel = require("../orders/orders.model");
const ProductModel = require("../products/products.model");

class SellerController {
  getSellerProducts = async (req, res, next) => {
    try {
      let authId = req.authUser._id;
      let allProducts = await ProductModel.find({
        sellerId: authId,
      });

      if (allProducts.length === 0) {
        return res.json({
          data: allProducts,
          status: true,
          msg: "No any product under this seller.",
        });
      }

      const productData = [];
      const productMeta = [];

      await Promise.all(
        allProducts.map(async (item) => {
          const response = await OrderModel.find({
            "orderDetails.id": new mongoose.Types.ObjectId(item._id),
          })
            .select("orderDetails")
            .populate({
              path: "orderDetails.id", // Specify the name of the Product model
            });

          response.forEach((order) => {
            // console.log(order, "order");
            const matchingOrderDetail = order.orderDetails.find(
              (orderDetail) => {
                return orderDetail.id._id.toString() === item._id.toString();
              }
            );

            if (
              matchingOrderDetail &&
              matchingOrderDetail.id._id.toString() === item._id.toString()
            ) {
              let totalQty = 0;
              let totalPrice = 0;
              totalQty += matchingOrderDetail.qty;
              totalPrice += matchingOrderDetail.amt;
              productMeta.push({
                totalPrice,
                totalQty,
                prodId: item._id.toString(),
              });

              //   console.log(
              //     totalprice,
              //     totalqty,
              //     matchingOrderDetail.id._id,
              //     "sdfcgbhj"
              //   );
              //price, qty, amt

              productData.push({
                details: matchingOrderDetail,
              });
            }
          });
        })
      );

      let productadskfj = [];
      allProducts.map((item) => {
        let totalProdQty = 0;
        let totalProdAmt = 0;
        productMeta.map((prod) => {
          if (item._id.toString() === prod.prodId) {
            totalProdQty += prod.totalQty;
            totalProdAmt += prod.totalPrice;
            productadskfj.push({
              totalProdAmt,
              totalProdQty,
              prodId: prod.prodId,
            });
          }
        });
      });

      const lastItems = {};

      productadskfj.forEach((item) => {
        lastItems[item.prodId] = item;
      });

      const result = Object.values(lastItems);

      res.json({
        data: allProducts,
        result,
        status: true,
        msg: "Product Fetched.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

const sellerControllerObj = new SellerController();
module.exports = sellerControllerObj;
