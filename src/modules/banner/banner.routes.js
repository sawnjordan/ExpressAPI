const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const { authCtrl } = require("../auth");
const bannerControllerObj = require("./banner.controller");

const router = require("express").Router();

const uploadDir = (req, res, next) => {
  let dir = "./public/uploads/banner";
  req.uploadDir = dir;
  next();
};

router.get("/home", bannerControllerObj.getBannerForHomePage);

router
  .route("/")
  .get(auth, checkPermission("admin"), bannerControllerObj.getAllBanners)
  .post(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.single("image"),
    bannerControllerObj.createBanner
  );

router
  .route("/:id")
  .put(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.single("image"),
    bannerControllerObj.updateBanner
  )
  .get(auth, checkPermission("admin"), bannerControllerObj.getBannerById)
  .delete(auth, checkPermission("admin"), bannerControllerObj.deleteBanner);
module.exports = router;
