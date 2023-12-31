const productServiceObj = require("../products/products.services");
const userControllerObj = require("../user/user.controller");
const orderServiceObj = require("./order.services");
const OrderModel = require("./orders.model");

class OrderController {
  placeNewOrder = async (req, res, next) => {
    try {
      let cartItems = req.body;
      if (!cartItems) {
        next({ status: 400, msg: "Your cart is empty!" });
      } else {
        let cartDetails = [];
        let formattedData = {
          orderDetails: null,
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
            price: item?.afterDiscount ?? item.price,
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
        });
        // console.log(cartDetails);
        formattedData.subTotal = Number(formattedData.subTotal.toFixed(2));
        formattedData.orderDetails = cartDetails;
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
        formattedData.buyer = req.authUser._id;
        formattedData.isPaid = false;
        delete formattedData.discount;
        delete formattedData.subTotal;
        // console.log(formattedData);

        const order = new OrderModel(formattedData);
        let response = await order.save();
        const result = await OrderModel.findById(response._id).populate({
          path: "orderDetails.id", // The field to populate
          model: "Product", // The model to use for population
          populate: {
            path: "sellerId", // The field to populate in 'Product'
            model: "User", // The model to use for population
          },
        });

        formattedData.orderDetails.map(async (item) => {
          await orderServiceObj.updateStock(item.id, item.qty);
        });

        res.json({
          data: result,
          status: true,
          msg: "Order has been placed.",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req, res, next) => {
    try {
      let allOrders = await OrderModel.find()
        .populate({
          path: "buyer",
          select:
            "-password -createdBy -createdAt -updatedAt -role -status -active -activationToken -passwordResetToken",
        })
        .populate("orderDetails.id")
        .sort({ _id: "desc" });

      res.json({
        data: allOrders,
        status: true,
        msg: "Order Fetched.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getAllMyOrders = async (req, res, next) => {
    try {
      let myId = req.authUser._id;
      let myOrders = await OrderModel.find({
        buyer: myId,
      })
        .populate({
          path: "buyer",
          select:
            "-password -createdBy -createdAt -updatedAt -role -status -active -activationToken -passwordResetToken",
        })
        .populate({
          path: "orderDetails.id",
          populate: {
            path: "brand",
          },
        })
        .sort({ _id: "desc" });

      res.json({
        data: myOrders,
        status: true,
        msg: "My Order Fetched.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getUserOrder = async (req, res, next) => {
    try {
      const orderId = req.params.id;
      let userOrder = await OrderModel.findById(orderId)
        .populate({
          path: "buyer",
          select:
            "-password -createdBy -createdAt -updatedAt -role -status -active -activationToken -passwordResetToken",
        })
        .populate("orderDetails.id")
        .sort({ _id: "desc" });

      res.json({
        data: userOrder,
        status: true,
        msg: "Order Fetched.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  getMyOrder = async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const userId = req.authUser._id;
      let userOrder = await OrderModel.find({ _id: orderId, buyer: userId })
        .populate({
          path: "buyer",
          select:
            "-password -createdBy -createdAt -updatedAt -role -status -active -activationToken -passwordResetToken",
        })
        .populate("orderDetails.id")
        .sort({ _id: "desc" });
      if (userOrder.length === 0) {
        return res.json({
          data: userOrder,
          status: true,
          msg: "Order not found. Please try again.",
        });
      }

      res.json({
        data: userOrder[0],
        status: true,
        msg: "Order Fetched successfully.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateUserOrder = async (req, res, next) => {
    try {
      const orderId = req.params.id;
      let userOrder = await OrderModel.findById(orderId);
      //status isPaid
      const { status, isPaid } = req.body;

      if (userOrder.status === "delivered") {
        return res.json({
          status: true,
          msg: "You have already delivered this order.",
        });
      }
      userOrder.status = status;
      userOrder.isPaid = isPaid;

      userOrder.save();

      res.json({
        data: userOrder,
        status: true,
        msg: "Order Updated successfully.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  updateMyOrder = async (req, res, next) => {
    try {
      const orderId = req.params.id;
      const userId = req.authUser._id;
      let userOrder = await OrderModel.find({ _id: orderId, buyer: userId });
      if (userOrder.length === 0) {
        return res.json({
          data: userOrder,
          status: true,
          msg: "Order not found. Please try again.",
        });
      }

      // console.log(userOrder, "here");
      const { status } = req.body;

      userOrder[0].status = status;
      // console.log(userOrder[0], "here");
      const updatedOrder = await userOrder[0].save();
      // console.log(updatedOrder);
      updatedOrder.orderDetails.map(async (item) => {
        await orderServiceObj.updateCancelledStock(item.id, item.qty);
      });

      res.json({
        data: updatedOrder,
        status: true,
        msg: "Order Cancelled.",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
const orderControllerObj = new OrderController();
module.exports = orderControllerObj;
