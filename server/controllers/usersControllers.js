const debug = require("debug")("file:controllers:usersControllers");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../database/models/User");

const registerUser = async (req, res, next) => {
  debug(chalk.yellow("Create a new user to the /users/register"));
  try {
    const newUser = await User.create(req.body);
    res.json(newUser).status(201);
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "User registration failed";
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const rightPassword = await bcrypt.compare(password, user.password);
    const { customerType } = user;
    if (rightPassword) {
      const token = jwt.sign(
        { username, customerType },
        process.env.JWT_SECRET
      );
      res.json({ token });
    } else {
      const error = new Error("Wrong credentials");
      error.code = 401;
      next(error);
    }
  } catch (error) {
    debug(chalk.red(error));
    if (error.isJoi === true) {
      error.status = 422;
    }
    error.message = "Authentification problem";
    next(error);
  }
};

const addFavourite = async (req, res, next) => {
  if (req.customerType !== "buyer") {
    debug(chalk.blue("A seller tried to add an apartment to favourites"));
    const error = new Error("Forbidden: only buyer can add to favourites");
    error.code = 403;
    next(error);
  }
  debug(
    chalk.yellow("Add apartment to the favourites list of the logged buyer")
  );

  const { userId, announcementId } = req.params;
  try {
    const loggedBuyer = await User.findOne({ userId });
    debug(chalk.yellow(loggedBuyer));
    if (!loggedBuyer.favourites.includes(announcementId)) {
      loggedBuyer.favourites.push(announcementId);
      await loggedBuyer.save();
    }
    res.json(loggedBuyer);
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    next(error);
  }
};

const deleteFavourite = async (req, res, next) => {
  if (req.customerType !== "buyer") {
    debug(chalk.blue("A seller tried to add an apartment to favourites"));
    const error = new Error("Forbidden: only buyer can add to favourites");
    error.code = 403;
    next(error);
  }
  debug(
    chalk.yellow(
      "Delete apartment from the favourites list of the logged buyer"
    )
  );
  const { userId, announcementId } = req.params;
  try {
    const loggedBuyer = await User.findOne({ userId });
    debug(chalk.yellow(loggedBuyer));
    if (loggedBuyer.favourites.includes(announcementId)) {
      const remainingFavourites = loggedBuyer.favourites.filter(
        (item) => item.toString() !== announcementId
      );
      loggedBuyer.favourites = remainingFavourites;
      await loggedBuyer.save();
    }
    res.json(loggedBuyer);
  } catch (error) {
    debug(chalk.red(error));
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  addFavourite,
  deleteFavourite,
};
