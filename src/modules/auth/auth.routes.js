const router = require("express").Router();
const multer = require("multer");
const { authCtrl } = require("./");
const uploader = require("../../middlewares/uploader.middleware");
const auth = require("../../middlewares/auth.middlware");

//file validation
//name
//a.jpg => a.jpg ayo vani file rename garni => unique
//ext/type - .png, .jpg, .jpeg, .svg, .webp, .gif, .bmp
//size

//name, email or phone
//email send with token activation token => url
//http://domain/verify-token/token

const uploadDir = (req, res, next) => {
  let dir = "./public/uploads/users";
  req.uploadDir = dir;
  next();
};

router.post(
  "/register",
  uploadDir,
  uploader.single("image"),
  authCtrl.registerUser
);

router.get("/verify-token/:token", authCtrl.verifyToken);

router.post("/password-reset/:token", authCtrl.setPassword);

router.post("/login", authCtrl.loginUser);

router.get("/me", auth, authCtrl.getLoggedInUserProfile);

router.get("/refresh-token", auth, authCtrl.refreshToken);

router.put("/me/:id", auth, authCtrl.editProfile);

router.post("/logout", auth, authCtrl.logoutUser);

module.exports = router;
