const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const { authCtrl } = require("../auth");
const sellerControllerObj = require("./seller.controller");

const router = require("express").Router();

router.get(
  "/products",
  auth,
  checkPermission("seller"),
  sellerControllerObj.getSellerProducts
);

// router
//   .route("/")
//   .get(auth, checkPermission("admin"), bannerControllerObj.getAllBanners)
//   .post(
//     auth,
//     checkPermission("admin"),
//     uploadDir,
//     uploader.single("image"),
//     bannerControllerObj.createBanner
//   );

// router
//   .route("/:id")
//   .put(
//     auth,
//     checkPermission("admin"),
//     uploadDir,
//     uploader.single("image"),
//     bannerControllerObj.updateBanner
//   )
//   .get(auth, checkPermission("admin"), bannerControllerObj.getBannerById)
//   .delete(auth, checkPermission("admin"), bannerControllerObj.deleteBanner);
module.exports = router;
