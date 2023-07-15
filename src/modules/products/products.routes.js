const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const productControllerObj = require("./products.controller");
const productServiceObj = require("./products.services");

const router = require("express").Router();

const uploadDir = (req, res, next) => {
  let dir = "./public/uploads/products";
  req.uploadDir = dir;
  next();
};

router.get("/home", productControllerObj.getProductForHomePage);

// router.get("/:slug", productControllerObj.getProductByProductSlug);

router
  .route("/")
  .get(productControllerObj.getAllProducts)
  .post(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.array("images"),
    productControllerObj.createProduct
  );

router
  .route("/:id")
  .put(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.array("images"),
    productControllerObj.updateProduct
  )
  .delete(auth, checkPermission("admin"), productControllerObj.deleteProduct);
// router.get("/:id", (req, res, next) => {
//   res.json({
//     msg: `I am GET Request for getting details of product with id:${req.params.id} `,
//   });
// });

module.exports = router;
