const express = require("express");
const auth = require("../middlewares/auth");

const {
  registerUser,
  loginUser,
  addFavourite,
  deleteFavourite,
} = require("../controllers/usersControllers");

const usersRoutes = express.Router();

usersRoutes.post("/register", registerUser);
usersRoutes.post("/login", loginUser);
usersRoutes.put("/:userId/favourites/:announcementId", auth, addFavourite);
usersRoutes.delete(
  "/:userId/favourites/:announcementId",
  auth,
  deleteFavourite
);

module.exports = usersRoutes;
