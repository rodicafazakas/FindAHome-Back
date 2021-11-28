const express = require("express");
const auth = require("../middlewares/auth");
const {
  getAnnouncements,
  getAnnouncementById,
  getFavouriteAnnouncements,
  getMyAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementsControllers");
const firebase = require("../middlewares/firebase");
const upload = require("../middlewares/upload");

const announcementsRoutes = express.Router();

announcementsRoutes.get("/", getAnnouncements);
announcementsRoutes.get("/:id", getAnnouncementById);
announcementsRoutes.get("/favourites", auth, getFavouriteAnnouncements);
announcementsRoutes.get("/myadverts", auth, getMyAnnouncements);
announcementsRoutes.post(
  "/new",
  upload.array("images", 3),
  firebase,
  auth,
  createAnnouncement
);
announcementsRoutes.put("/:id", auth, updateAnnouncement);
announcementsRoutes.delete("/:id", auth, deleteAnnouncement);

module.exports = announcementsRoutes;
