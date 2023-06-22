const { route } = require("../brand/brand.routes");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json({ msg: "This is GET request to get all the categories." });
});

router.post("/", (req, res, next) => {
  res.json({ msg: "I am POST request to create a new category" });
});

router.put("/:id", (req, res, next) => {
  res.json({
    msg: `This is PUT request to edit a category with id: ${req.params.id}`,
  });
});

router.delete("/:id", (req, res, next) => {
  res.json({
    msg: `This is DELETE request for a category with id: ${req.params.id}`,
  });
});

router.get("/:id", (req, res, next) => {
  res.json({
    msg: `This is GET request for a category with id: ${req.params.id}`,
  });
});
module.exports = router;
