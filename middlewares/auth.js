const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_ERROR } = require("../utils/errors");

const authError = (res) => {
  res.status(UNAUTHORIZED_ERROR).send({ message: "Authorization Required" });
};

// eslint-disable-next-line consistent-return
const handleAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return authError(res);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return authError(res);
  }

  req.user = payload;
  next();
};

module.exports = { handleAuthorization };
