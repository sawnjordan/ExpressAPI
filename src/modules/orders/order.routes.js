const auth = require("../../middlewares/auth.middlware");
const checkPermission = require("../../middlewares/rbac.middleware");
const orderControllerObj = require("./orders.controller");

const router = require("express").Router();

// router.get("/", (req, res, next) => {
//   res.json({ msg: "This is GET request to get all orders" });
// });

router.post("/", auth, orderControllerObj.placeNewOrder);

router.get(
  "/",
  auth,
  checkPermission("admin"),
  orderControllerObj.getAllOrders
);
router.get("/me", auth, orderControllerObj.getAllMyOrders);
router.get(
  "/:id",
  auth,
  checkPermission("admin"),
  orderControllerObj.getUserOrder
);
router.put(
  "/:id",
  auth,
  checkPermission("admin"),
  orderControllerObj.updateUserOrder
);

// router.get("/:id", (req, res, next) => {
//   res.json({
//     msg: `This is GET request to get a specific order of id: ${req.params.id}`,
//   });
// });

// router.put("/:id", (req, res, next) => {
//   res.json({
//     msg: `This is PUT request to update a specific order of id: ${req.params.id}`,
//   });
// });

// router.delete("/:id", (req, res, next) => {
//   res.json({
//     msg: `This is DELETE request to delete a specific order of id: ${req.params.id}`,
//   });
// });

module.exports = router;
