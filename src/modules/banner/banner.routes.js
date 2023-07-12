const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const { authCtrl } = require("../auth");
const bannerControllerObj = require("./banner.controller");

const router = require("express").Router();

const uploadDir = (req, res, next) => {
  let dir = "./public/uploads";
  req.uploadDir = dir;
  next();
};

router.get(
  "/",
  auth,
  checkPermission("admin"),
  bannerControllerObj.getAllBanners
);

router.post(
  "/",
  auth,
  checkPermission("admin"),
  uploadDir,
  uploader.single("image"),
  bannerControllerObj.createBanner
);

// router.put(
//   "/:id",
//   auth,
//   checkPermission("admin"),
//   bannerControllerObj.updateBanner
// );
module.exports = router;
