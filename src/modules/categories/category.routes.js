const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.middleware");
// const { authCtrl } = require("../auth");
const categoryControllerObj = require("./category.controller");

const router = require("express").Router();

const uploadDir = (req, res, next) => {
  let dir = "./public/uploads/category";
  req.uploadDir = dir;
  next();
};

router.get("/home", categoryControllerObj.getCategoryForHomePage);

router
  .route("/")
  .get(auth, checkPermission("admin"), categoryControllerObj.getAllCategories)
  .post(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.single("image"),
    categoryControllerObj.createCategory
  );

router
  .route("/:id")
  .put(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.single("image"),
    categoryControllerObj.updateCategory
  )
  .get(auth, checkPermission("admin"), categoryControllerObj.getCategoryById)
  .delete(auth, checkPermission("admin"), categoryControllerObj.deleteCategory);
module.exports = router;
