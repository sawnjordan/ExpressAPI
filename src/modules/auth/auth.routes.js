const router = require("express").Router();
const { authCtrl } = require("./");

//name, email or phone
//email send with token activation token => url
//http://domain/verify-token/token

router.post("/register", authCtrl.registerUser);

router.get("/verify-token/:token", authCtrl.verifyToken);

router.post("/password-reset", authCtrl.passwordReset);

router.post("/login", authCtrl.loginUser);

router.get("/me", authCtrl.viewProfile);

router.put("/me/:id", authCtrl.editProfile);

router.post("/logout", authCtrl.logoutUser);

module.exports = router;
