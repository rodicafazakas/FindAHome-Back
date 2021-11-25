const express = require("express");
const auth = require("../middlewares/auth");
const {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementsControllers");
const firebase = require("../middlewares/firebase");
const upload = require("../middlewares/upload");

const announcementsRoutes = express.Router();

announcementsRoutes.get("/", getAnnouncements);
announcementsRoutes.get("/:id", getAnnouncementById);
announcementsRoutes.post(
  "/new",
  auth,
  upload.single("image"),
  firebase,
  createAnnouncement
);
announcementsRoutes.put("/:id", auth, updateAnnouncement);
announcementsRoutes.delete("/:id", auth, deleteAnnouncement);

module.exports = announcementsRoutes;
