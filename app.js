const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

const routes = require("./routes");

/* User Authorization Middleware */
app.use((req, res, next) => {
  req.user = {
    _id: "65ac061e352ff15445b6dae6",
  };
  next();
});

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
