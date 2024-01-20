const router = require("express").Router();

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
router.post("/", createItem);

/* PUT Routes */

// PUT /items/:itemId/likes - like an item
router.put("/:itemId/likes", likeItem);

/* DELETE Routes */

// DELETE /items/:itemId - deletes an item by _id
router.delete("/:itemId", deleteItem);

// DELETE /items/:itemId/likes - unlike an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
