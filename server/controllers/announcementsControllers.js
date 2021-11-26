const debug = require("debug")("file:server:announcementsControllers");
const chalk = require("chalk");

const Announcement = require("../../database/models/Announcement");

const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find();
  res.json(announcements);
};

const getAnnouncementById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const searchedAnnouncement = await Announcement.findById(id);
    if (searchedAnnouncement) {
      res.json(searchedAnnouncement);
    } else {
      const error = new Error("Announcement not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  if (req.customerType !== "seller") {
    const error = new Error("Forbidden: only seller can update announcement");
    error.code = 403;
    next(error);
  }
  try {
    const newAnnouncement = await Announcement.create(req.body);
    res.status(201).json(newAnnouncement);
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "Bad create request";
    next(error);
  }
};

const createAnnouncement2 = async (req, res) => {
  if (req.file) {
    debug(chalk.red(`File url: ${req.file.fileURL}`));
  }
  res.status(200).json({});
};

const updateAnnouncement = async (req, res, next) => {
  if (req.customerType !== "seller") {
    const error = new Error("Forbidden: only seller can update announcement");
    error.code = 403;
    next(error);
  }
  debug(chalk.yellow("Modify announcement at /announcements/id"));
  const { id } = req.params;
  try {
    const announcementToUpdate = await Announcement.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (announcementToUpdate) {
      res.json(announcementToUpdate);
    } else {
      const error = new Error("Announcement not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "Cannot update the announcement";
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  if (req.customerType !== "seller") {
    const error = new Error("Forbidden: only seller can update announcement");
    error.code = 403;
    next(error);
  }
  const { id } = req.params;
  try {
    const announcementToDelete = await Announcement.findByIdAndDelete(id);
    if (announcementToDelete) {
      res.json(announcementToDelete);
    } else {
      const error = new Error("Announcement not found");
      error.code = 404;
      next(error);
    }
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "Cannot delete the announcement";
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  createAnnouncement2,
  updateAnnouncement,
  deleteAnnouncement,
};
