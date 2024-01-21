const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRoutes = require("./users");
const { NOT_FOUND_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", userRoutes);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
