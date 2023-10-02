const productServiceObj = require("../products/products.services");
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

        res.json({
          data: response,
          status: true,
          msg: "Order has been placed.",
        });
      }
    } catch (error) {
      next(error);
    }
  };
}
const orderControllerObj = new OrderController();
module.exports = orderControllerObj;
