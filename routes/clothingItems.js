const router = require("express").Router();
const { handleAuthorization } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

/* GET Routes */

// GET /items - returns all clothing items
router.get("/", getItems);

/* POST Routes */

// POST /items - creates a new item
router.post("/", handleAuthorization, createItem);

/* PUT Routes */

// PUT /items/:itemId/likes - like an item
router.put("/:itemId/likes", handleAuthorization, likeItem);

/* DELETE Routes */

// DELETE /items/:itemId - deletes an item by _id
router.delete("/:itemId", handleAuthorization, deleteItem);

// DELETE /items/:itemId/likes - unlike an item
router.delete("/:itemId/likes", handleAuthorization, dislikeItem);

module.exports = router;
