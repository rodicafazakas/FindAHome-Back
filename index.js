require('dotenv').config();
const debug = require('debug')('file:root:index');
const chalk = require('chalk');

const connectDB = require('./database/index');
const { initializeServer } = require('./server/index');

const port = process.env.PORT ?? 5000;

(async () => {
  try {
    await connectDB(process.env.MONGODB_STRING);
    await initializeServer(port);
  } catch (error) {
    debug(chalk.red('PROCESS EXIT'));
    process.exit(1);
  }
})();
