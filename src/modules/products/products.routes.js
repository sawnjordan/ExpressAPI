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

router.get("/search", productControllerObj.getSearchResult);

router.get("/slug/:productSlug", productControllerObj.getProductBySlug);

router.post("/cart-details", productControllerObj.getCartDetails);

router
  .route("/:id")
  .put(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.array("images"),
    productControllerObj.updateProduct
  )
  .get(auth, checkPermission("admin"), productControllerObj.getProductById)
  .delete(auth, checkPermission("admin"), productControllerObj.deleteProduct);
router.delete(
  "/:productId/:imgName",
  auth,
  checkPermission("admin"),
  productControllerObj.deleteImage
);

module.exports = router;
