const debug = require('debug')('file:controllers:usersControllers');
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../database/models/User');

const registerUser = async (req, res, next) => {
  debug(chalk.yellow('Create a new user to the /users/register'));
  try {
    const newUser = await User.create(req.body);
    res.json(newUser).status(200);
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = 'User registration failed';
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    const rightPassword = await bcrypt.compare(password, user.password);
    if (rightPassword) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      const error = new Error('Wrong credentials');
      error.code = 401;
      next(error);
    }
  } catch (error) {
    debug(chalk.red(error));
    error.message = 'Authentification problem';
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
