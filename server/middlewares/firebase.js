const debug = require("debug")("file: server:firebase");
const chalk = require("chalk");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "findahome-c291c.appspot.com",
});

const firebase = async (req, res, next) => {
  try {
    const bucket = admin.storage().bucket();
    await bucket.upload(req.file.path);
    await bucket.file(req.file.filename).makePublic();
    const fileURL = bucket.file(req.file.filename).publicURL();
    debug(chalk.green(fileURL));
    req.body.images = fileURL;
    next();
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "Something failed while uploading to firebase";
    next(error);
  }
};

module.exports = firebase;
