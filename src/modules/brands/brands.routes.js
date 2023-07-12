const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const brandControllerObj = require("./brands.controller");
const brandServiceObj = require("./brands.services");

const router = require("express").Router();

const uploadDir = (req, res, next) => {
  let dir = "./public/uploads/brands";
  req.uploadDir = dir;
  next();
};

router
  .route("/")
  .get(brandControllerObj.getAllBrands)
  .post(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.single("logo"),
    brandControllerObj.createBrand
  );

router.put("/:id", (req, res, next) => {
  res.json({
    msg: `I am PUT Request for updating brand with id:${req.params.id} `,
  });
});
router.delete("/:id", (req, res, next) => {
  res.json({
    msg: `I am DELETE Request for deleting brand with id:${req.params.id} `,
  });
});
router.get("/:id", (req, res, next) => {
  res.json({
    msg: `I am GET Request for getting details of brand with id:${req.params.id} `,
  });
});

module.exports = router;
