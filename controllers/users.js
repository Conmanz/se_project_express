const User = require("../models/user");
const { ObjectId } = require("mongodb");
const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch((e) => {
      console.error(e);
      res.status(DEFAULT_ERROR).send({ message: "Error from getUsers" });
    });
};

const getUser = (req, res) => {
  const { _id } = req.params;
  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((e) => {
      console.error(`Error: ${e.name} - Message: ${e.message}\n`, e.stack);

      switch (e.name) {
        /** _id not found */
        case "DocumentNotFoundError": {
          res.status(NOT_FOUND_ERROR).send({
            message: `No User found with _id of ${_id}`,
          });
          break;
        }
        /** Invalid _id */
        case "CastError": {
          res
            .status(INVALID_DATA_ERROR)
            .send({ message: `Invalid _id: ${_id}` });
          break;
        }
        default: {
          res.status(DEFAULT_ERROR).send({ message: "Error from getUser" });
          break;
        }
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((e) => {
      console.error(e);
      if (e.name === `ValidationError`) {
        res.status(INVALID_DATA_ERROR).send({ message: e.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from createUser" });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
