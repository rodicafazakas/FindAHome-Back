const debug = require('debug')('file:server:index');
const chalk = require('chalk');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { notFoundErrorHandler, generalErrorHandler } = require('./middlewares/errors');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

let server;
const initializeServer = (port) => new Promise((resolve, reject) => {
  server = app.listen(port, () => {
    debug(chalk.yellow(`Listening to port ${port}`));
    resolve(server);
  });

  server.on('error', (error) => {
    debug(chalk.red('Error when initializing server'));
    if (error.code === 'EADDRINUSE') {
      debug(chalk.red(`The port ${port} is in use`));
    }
    reject(error);
  });
});

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/users', usersRoutes);

app.use(notFoundErrorHandler);
app.use(generalErrorHandler);

module.exports = { app, initializeServer };
