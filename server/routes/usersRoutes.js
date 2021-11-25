const { validate } = require("express-validation");
const express = require("express");
const auth = require("../middlewares/auth");

const {
  registerUser,
  loginUser,
  addFavourite,
  deleteFavourite,
} = require("../controllers/usersControllers");
const loginValidation = require("../schemas/userSchema");

const usersRoutes = express.Router();

usersRoutes.post("/register", registerUser);
usersRoutes.post("/login", validate(loginValidation), loginUser);
usersRoutes.put("/:userId/favourites/:announcementId", auth, addFavourite);
usersRoutes.delete(
  "/:userId/favourites/:announcementId",
  auth,
  deleteFavourite
);

module.exports = usersRoutes;
