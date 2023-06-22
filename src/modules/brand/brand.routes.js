const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    res.json({ msg: "I am all brand list (GET Request)" });
  })
  .post((req, res, next) => {
    res.json({ msg: "I am create brand (POST Request)" });
  });

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
