const { route } = require("../brands/brands.routes");

const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    res.json({ msg: "This is GET request to get all the categories." });
  })
  .post((req, res, next) => {
    res.json({ msg: "I am POST request to create a new category" });
  });

router
  .route("/:id")
  .put((req, res, next) => {
    res.json({
      msg: `This is PUT request to edit a category with id: ${req.params.id}`,
    });
  })
  .delete((req, res, next) => {
    res.json({
      msg: `This is DELETE request for a category with id: ${req.params.id}`,
    });
  })
  .get((req, res, next) => {
    res.json({
      msg: `This is GET request for a category with id: ${req.params.id}`,
    });
  });

module.exports = router;
