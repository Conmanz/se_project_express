const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

/* GET Routes */

router.get("/me", handleAuthorization, getCurrentUser);

// PATCH /users/me - update profile
router.patch("/me", handleAuthorization, updateUser);

module.exports = router;
