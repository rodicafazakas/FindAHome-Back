const debug = require("debug")("file:server:index");
const chalk = require("chalk");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const {
  notFoundErrorHandler,
  generalErrorHandler,
} = require("./middlewares/errors");
const usersRoutes = require("./routes/usersRoutes");
const announcementsRoutes = require("./routes/announcementsRoutes");

const app = express();

let server;
const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      debug(chalk.yellow(`Listening to port ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.red("Error when initializing server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`The port ${port} is in use`));
      }
      reject(error);
    });
  });

app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // built in middleware function that parses incoming requests with JSON payloads and is based on body-parser

app.use("/users", usersRoutes);
app.use("/announcements", announcementsRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = { app, initializeServer };
