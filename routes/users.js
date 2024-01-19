const router = require("express").Router();

const { getUsers, getUser, createUser, temp } = require("../controllers/users");

//CRUD

//Create
router.post("/", createUser);
router.post("/:_temp", (req, res) => {
  console.log(`router body: `, req.body);
  temp(req, res);
});

//Read
router.get("/:_id", getUser);
router.get("/", getUsers);

//Update

//Delete

module.exports = router;

// GET /users — returns all users
// GET /users/:userId - returns a user by _id
// POST /users — creates a new user
