const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
var proxy = require("http-proxy-middleware");

const { BigPromise } = require("./utils/BigPromise.js");
const homeRoutes = require("./routes/homeRoutes.js");

const UserModel = require("./models/User.js");

const {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} = require("./middlewares/error-handler-middlewares.js");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static("./public/build"));
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// root route to deliver the react bundle

app.get("/", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "./public/build/index.html"));
});

// routes here
app.use("/api/v1/auth", homeRoutes);

app.get("*", (req, res) => {
  // console.log(path.resolve(__dirname, "./public/index.html"));
  res.sendFile(path.resolve(__dirname, "./public/build/index.html"));
});

// error handler middlewares
app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

module.exports = app;
