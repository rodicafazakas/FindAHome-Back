const debug = require("debug")("file: server:firebase");
const chalk = require("chalk");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "findahome-c291c.appspot.com",
});

const firebase = (req, res, next) => {
  try {
    const bucket = admin.storage().bucket();
    req.body.images = [];
    req.files.map(async (image) => {
      await bucket.upload(image.path);
      await bucket.file(image.filename).makePublic();
      const fileURL = bucket.file(image.filename).publicUrl();
      req.body.images.push(fileURL);
      next();
    });
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "Something failed while uploading to firebase";
    next();
  }
};

module.exports = firebase;
