const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
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
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!email) {
        throw new Error("Enter a valid email");
      }
      if (user) {
        throw new Error("Email is already taken");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userPayload = user.toObject();
      delete userPayload.password;
      res.status(201).send({
        data: userPayload,
      });
    })

    .catch((err) => {
      console.error(err);
      if (err.name === `ValidationError`) {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid Request Error on createUser" });
      } else if (err.message === "Enter a valid email") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid Error on createUser" });
      } else if (err.message === "Email is already taken") {
        res
          .status(CONFLICT_ERROR)
          .send({ message: "Email already exists in database" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

// const createUser = (req, res) => {
//   const { name, avatar } = req.body;
//   User.create({ name, avatar })
//     .then((user) => res.send(user))
//     .catch((e) => {
//       console.error(e);
//       if (e.name === `ValidationError`) {
//         res.status(INVALID_DATA_ERROR).send({ message: e.message });
//       } else {
//         res.status(DEFAULT_ERROR).send({ message: "Error from createUser" });
//       }
//     });
// };

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(INVALID_DATA_ERROR).send({ message: "Invalid Email" });
    return;
  }

  if (!password) {
    res.status(INVALID_DATA_ERROR).send({ message: "Invalid Password" });
    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        res
          .status(UNAUTHORIZED_ERROR)
          .send({ message: "Unauthorized Credentials" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const getCurrentUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Unknown User"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
      }
    });
};

const updateUser = (req, res) => {
  const id = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === "User not found") {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
