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

      const productData = await Promise.all(
        allProducts.map(async (item) => {
          const resData = await OrderModel.aggregate([
            {
              $unwind: {
                path: "$orderDetails",
              },
            },
            {
              $match: {
                "orderDetails.id": new mongoose.Types.ObjectId(item.id),
              },
            },
            {
              $group: {
                _id: "$orderDetails.id",
                totalAmt: {
                  $sum: "$orderDetails.amt",
                },
                totalQty: {
                  $sum: "$orderDetails.qty",
                },
              },
            },
            {
              $lookup: {
                from: "products", // The name of the product collection
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
              },
            },
            {
              $project: {
                _id: 1,
                totalAmt: 1,
                totalQty: 1,
                productDetails: { $arrayElemAt: ["$productDetails", 0] },
              },
            },
          ]);

          return resData[0];
        })
      );
      // console.log(productData, "here");

      res.json({
        data: productData,
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
