// const express = require("express");
// const router = express.Router(); //Provides us a middleware capable enough to handle all routing

const router = require("express").Router(); //mathi ko two line of code is same as this line of code
const brandRoutes = require("../modules/brands/brands.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const authRoutes = require("../modules/auth/auth.routes");
const bannerRoutes = require("../modules/banner/banner.routes");
const productRoutes = require("../modules/products/products.routes");
const userRoutes = require("../modules/user/user.routes");
const orderRoutes = require("../modules/orders/order.routes");
const sellerRoutes = require("../modules/seller/seller.routes");

//TODO: Route mount

router.use("/auth", authRoutes);
router.use("/banner", bannerRoutes);
router.use("/brands", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/products", productRoutes);
router.use("/user", userRoutes);
router.use("/orders", orderRoutes);
router.use("/seller", sellerRoutes);

// router.use((req, res, next) => {
//   console.log("I am always called");
//   next();
// });

// const authCheck = (req, res, next) => {
//   console.log("I am only called on /me router");
//   next();
// };

// const loginMiddleware = (request, response, next) => {
//   console.log("I am called on the /login route");
//   next();
// };

// router.post("/register", (request, response, next) => {
//   //Business Logic

//   response.status(200).json({ msg: "User has been registered successfully" });
// });

// router.post("/login", loginMiddleware, (request, response, next) => {
//   //login process
//   response.json({ msg: "Login Successful" });
// });

module.exports = router;
