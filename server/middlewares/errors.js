const debug = require('debug')('file:server:errors');
const chalk = require('chalk');

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: 'Page not found' });
};

// eslint-disable-next-line no-unused-vars
const generalErrorHandler = (error, req, res, next) => {
  debug(chalk.red('An error has ocurred'), chalk.red(error.message));
  res.status(500).json({ error: 'An error has ocurred' });
};

module.exports = { notFoundErrorHandler, generalErrorHandler };
