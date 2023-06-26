const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json({ msg: "This is GET request to get all orders" });
});

router.post("/", (req, res, next) => {
  res.json({ msg: "This is POST request to create a new order" });
});

router.get("/:id", (req, res, next) => {
  res.json({
    msg: `This is GET request to get a specific order of id: ${req.params.id}`,
  });
});

router.put("/:id", (req, res, next) => {
  res.json({
    msg: `This is PUT request to update a specific order of id: ${req.params.id}`,
  });
});

router.delete("/:id", (req, res, next) => {
  res.json({
    msg: `This is DELETE request to delete a specific order of id: ${req.params.id}`,
  });
});

module.exports = router;