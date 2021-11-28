const jwt = require("jsonwebtoken");
const debug = require("debug")("file:middlewares:auth");
const chalk = require("chalk");

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  debug(chalk.yellow(`Auth header ${authHeader}`));
  if (!authHeader) {
    const error = new Error("Missing authorization");
    error.code = 401;
    next(error);
  } else {
    const token = authHeader.split(" ")[1];
    if (!token) {
      const error = new Error("Missing token");
      error.code = 401;
      next(error);
    } else {
      try {
        const user = await jwt.verify(token, process.env.JWT_SECRET);
        req.customerType = user.customerType;
        req.username = user.username;
        req.userId = user.id;
        next();
      } catch (error) {
        debug(chalk.red(error));
        error.code = 401;
        error.message = "Invalid token";
        next(error);
      }
    }
  }
};

module.exports = auth;
