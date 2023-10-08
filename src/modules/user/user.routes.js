const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const userControllerObj = require("./user.controller");
const userServiceObj = require("./user.services");

const router = require("express").Router();

const uploadDir = (req, res, next) => {
  let dir = "./public/uploads/users";
  req.uploadDir = dir;
  next();
};

// router.get("/:slug", userControllerObj.getProductByUserSlug);

router.route("/").get(userControllerObj.getAllUsers);

router.put("/wishlist", auth, userControllerObj.addToWishlist);
router.get("/wishlist", auth, userControllerObj.getWishlist);

router.put(
  "/update",
  auth,
  uploadDir,
  uploader.single("image"),
  userControllerObj.updateMe
);

router
  .route("/:id")
  .put(
    auth,
    checkPermission("admin"),
    uploadDir,
    uploader.single("image"),
    userControllerObj.updateUser
  )
  .get(auth, checkPermission("admin"), userControllerObj.getUserById)
  .delete(auth, checkPermission("admin"), userControllerObj.deleteUser);

module.exports = router;
