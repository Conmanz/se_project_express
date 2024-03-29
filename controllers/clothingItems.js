const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((e) => {
      console.error(e);
      if (e.name === `ValidationError`) {
        res.status(INVALID_DATA_ERROR).send({ message: e.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from createItem" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find()
    .then((items) => res.send(items))
    .catch((e) => {
      console.error(e);
      res.status(DEFAULT_ERROR).send({ message: "Error from getItems" });
    });
};

// Handling Deleting Item

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN_ERROR)
          .send({ message: "You are not authorized to delete this item" });
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((e) => {
      console.error(e);

      switch (e.name) {
        /** _id not found */
        case "DocumentNotFoundError": {
          res.status(NOT_FOUND_ERROR).send({
            message: `No ClothingItem found with _id of ${itemId}`,
          });
          break;
        }
        /** Invalid _id */
        case "CastError": {
          res
            .status(INVALID_DATA_ERROR)
            .send({ message: `Invalid _id: ${itemId}` });
          break;
        }
        default: {
          res.status(DEFAULT_ERROR).send({ message: "Error from deleteItem" });
          break;
        }
      }
    });
};

// Handling Likes/Dislikes

const likeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((e) => {
      console.error(e);
      switch (e.name) {
        /** _id not found */
        case "DocumentNotFoundError": {
          res.status(NOT_FOUND_ERROR).send({
            message: `No ClothingItem found with _id of ${itemId}`,
          });
          break;
        }
        /** Invalid _id */
        case "CastError": {
          res
            .status(INVALID_DATA_ERROR)
            .send({ message: `Invalid ClothingItem _id: ${itemId}` });
          break;
        }
        default: {
          res.status(DEFAULT_ERROR).send({ message: "Error from likeItem" });
          break;
        }
      }
    });
};

const dislikeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((e) => {
      console.error(e);
      switch (e.name) {
        /** _id not found */
        case "DocumentNotFoundError": {
          res.status(NOT_FOUND_ERROR).send({
            message: `No ClothingItem found with _id of ${itemId}`,
          });
          break;
        }
        /** Invalid _id */
        case "CastError": {
          res
            .status(INVALID_DATA_ERROR)
            .send({ message: `Invalid ClothingItem _id: ${itemId}` });
          break;
        }
        default: {
          res.status(DEFAULT_ERROR).send({ message: "Error from dislikeItem" });
          break;
        }
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
