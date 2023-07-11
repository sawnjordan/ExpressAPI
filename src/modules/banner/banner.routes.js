const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const bannerControllerObj = require("./banner.controller");

const router = require("express").Router();

router.get(
  "/banner",
  auth,
  checkPermission("admin"),
  bannerControllerObj.getAllBanners
);

module.exports = router;
