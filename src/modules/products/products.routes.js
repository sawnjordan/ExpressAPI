const router = require("express").Router();

router
  .route("/")
  .get((req, res, next) => {
    res.json({ msg: "This is GET request to list all the products." });
  })
  .post((req, res, next) => {
    res.json({ msg: "I am POST request to create a new product" });
  });

router
  .route("/:id")
  .put((req, res, next) => {
    res.json({
      msg: `This is PUT request to edit a product with id: ${req.params.id}`,
    });
  })
  .delete((req, res, next) => {
    res.json({
      msg: `This is DELETE request for a product with id: ${req.params.id}`,
    });
  })
  .get((req, res, next) => {
    res.json({
      msg: `This is GET request for a product with id: ${req.params.id}`,
    });
  });

module.exports = router;
