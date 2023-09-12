const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const productControllerObj = require("./products.controller");

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
  .get(auth, checkPermission("admin"), productControllerObj.getAllProducts)
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

module.exports = router;
