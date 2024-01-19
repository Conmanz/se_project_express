const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRoutes = require("./users");
const { DEFAULT_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", userRoutes);

router.use((req, res) => {
  res.status(DEFAULT_ERROR).send({ message: "Router not found" });
});

module.exports = router;
