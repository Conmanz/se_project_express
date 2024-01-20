const router = require("express").Router();

const { getUsers, getUser, createUser, temp } = require("../controllers/users");

/* GET Routes */

// GET /users — returns all users
router.get("/", getUsers);

// GET /users/:userId - returns a user by _id
router.get("/:_id", getUser);

/* POST Routes */

// POST /users — creates a new user
router.post("/", createUser);

module.exports = router;
