const router = require("express").Router();

router.post("/register", (req, res) => {
  res.json({ msg: "This is POST request to register a user." });
});

router.post("/login", (req, res) => {
  res.json({ msg: "This is POST request to login a user." });
});

router.post("/logout", (req, res, next) => {
  res.json({ msg: "This is POST request to logout." });
});

router.get("/profile", (req, res, next) => {
  res.json({
    msg: "This is GET request to view logged in user profile information.",
  });
});

router.post("/profile/edit", (req, res, next) => {
  res.json({
    msg: "This is POST request to edit logged in user profile information.",
  });
});

router.post("/password/reset", (req, res, next) => {
  res.json({ msg: "This is POST request to reset the password." });
});

module.exports = router;
