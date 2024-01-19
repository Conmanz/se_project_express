const ClothingItem = require("../models/clothingItem");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageURL } = req;

  ClothingItem.create({ name, weather, imageURL, owner: req.user._id })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(DEFAULT_ERROR).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((e) => {
      console.error(e);
      console.log(err.name);
      res.status(DEFAULT_ERROR).send({ message: "Error from getItems" });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.param;
//   const { imageURL } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
//     .orFail()
//     .then((item) => res.status);
// };

//Handling Deleting Item

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Item is deleted" }))
    .catch((e) => {
      console.error(e);
      if (e.name === `CastError`) {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: `${e.name} error on deleteItem` });
      } else if (e.name === "DocumentNotFoundError") {
        res.status(NOTFOUND_ERROR).send({ message: "Error from deleteItem" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "deleteItem Failed" });
      }
    });
};

//Handling Likes/Dislikes

const likeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESSFUL).send({ data: item }))
    .catch((e) => {
      console.error(e);
      if (e.name === `DocumentNotFoundError`) {
        res
          .status(NOTFOUND_ERROR)
          .send({ message: `${e.name} Error at likeItem` });
      } else if (e.name === `CastError`) {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid Credentials Unable to Add Like" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
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
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        res
          .status(NOTFOUND_ERROR)
          .send({ message: `${e.name} Error at dislikeItem` });
      } else if (e.name === `CastError`) {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid Credential Unable to Remove Like" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
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
