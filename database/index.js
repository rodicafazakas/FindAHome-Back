const debug = require('debug')('file:database:index');
const chalk = require('chalk');
const mongoose = require('mongoose');

const connectDB = (connectionString) => new Promise((resolve, reject) => {
  mongoose.set('debug', true);
  mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      // eslint-disable-next-line no-underscore-dangle
      delete ret._id;
      // eslint-disable-next-line no-underscore-dangle
      delete ret.__v;
    },
  });

  mongoose.connection
    .on('open', () => { debug(chalk.yellow('The database connection is open')); })
    .on('close', () => { debug(chalk.yellow('The database connection is closed')); });

  mongoose.connect(connectionString, (error) => {
    if (error) {
      debug(chalk.red('Connection denied'));
      debug(chalk.red(error.message));
      reject(error);
    }
    debug(chalk.green('Successful connection'));
    resolve();
  });
});

module.exports = connectDB;
