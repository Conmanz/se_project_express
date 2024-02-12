const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");

/* GET Routes */

// GET /users — returns all users
// router.get("/", getUsers);

// GET /users/:userId - returns a user by _id
// router.get("/:_id", getUser);

/* POST Routes */

// POST /users — creates a new user
// router.post("/", createUser);

router.get("/me/:_id", getCurrentUser);

// PATCH /users/me - update profile
router.patch("/me", updateUser);

module.exports = router;
