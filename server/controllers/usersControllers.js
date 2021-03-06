const debug = require("debug")("file:controllers:usersControllers");
const chalk = require("chalk");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../database/models/User");

const registerUser = async (req, res, next) => {
  debug(chalk.yellow("Create a new user to the /users/register"));
  try {
    const newUser = req.body;
    newUser.password = await bcrypt.hash(newUser.password, 10);
    const registeredUser = await User.create(newUser);
    res.status(201).json(registeredUser);
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
    const { customerType, id } = user;
    if (rightPassword) {
      const token = jwt.sign(
        { username, customerType, id },
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

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("favourites")
      .populate("adverts");
    res.json(user);
  } catch (error) {
    debug(chalk.red(error));
    next(error);
  }
};

const addFavourite = async (req, res, next) => {
  debug(
    chalk.yellow("Add apartment to the favourites list of the logged buyer")
  );

  const { userId, announcementId } = req.params;
  try {
    const loggedBuyer = await User.findById(userId);
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
  getUser,
};
