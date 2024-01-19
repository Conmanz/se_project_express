const User = require("../models/user");
const { ObjectId } = require("mongodb");
const {
  INVALID_DATA_ERROR,
  NOTFOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((e) => {
      console.error(e);
      res.status(DEFAULT_ERROR).send({ message: "Error from getUsers" });
    });
};

const getUser = (req, res) => {
  console.log(req.params);
  const { _id } = req;
  User.find(ObjectId(_id))
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((e) => {
      console.error(e);
      if (e.name === "IdentificationNotFound") {
        res.status(NOTFOUND_ERROR).send({ message: e.message });
      } else if (e.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Error from getUser(ID)" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from getUser" });
      }
    });
};

const createUser = (req, res) => {
  console.log(req.body);
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      console.error(e);
      if (e.name === `ValidationError`) {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Validation error from createUser" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from createUser " });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};

/* const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  User.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(500).send({ message: "Error from createItem", e });
    });
};

const getItems = (req, res) => {
  User.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(500).send({ message: "Error from getItems", e });
    });
};

const updateItem = (req, res) => {
  const {itemId} = req.param;
  const {imageURL} = req.body;

  User.findByIdAndUpdate(itemId, {$set: {imageURL}}).orFail().then((item) => res.status)
} */
