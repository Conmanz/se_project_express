const router = require("express").Router();
const clothingItem = require("./clothingItems");
const userRoutes = require("./users");
const { NOT_FOUND_ERROR } = require("../utils/errors");
const { loginUser, createUser } = require("../controllers/users");
const { handleAuthorization } = require("../middlewares/auth");

router.use("/items", clothingItem);
router.use("/users", userRoutes);

router.post("/signin", handleAuthorization, loginUser);
router.post("/signup", handleAuthorization, createUser);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Router not found" });
});

module.exports = router;
