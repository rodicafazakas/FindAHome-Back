const debug = require("debug")("file:server:announcementsControllers");
const chalk = require("chalk");

const Announcement = require("../../database/models/Announcement");
const User = require("../../database/models/User");

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

const getFavouriteAnnouncements = async (req, res, next) => {
  try {
    const user = await User.findById(req.userid).populate("favourites");
    res.json(user.favourites);
  } catch (error) {
    debug(chalk.red(error));
    next(error);
  }
};

const getMyAnnouncements = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("adverts");
    res.json(user.adverts);
  } catch (error) {
    debug(chalk.red(error));
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
    const user = await User.findById(req.userId);
    res.status(201).json(newAnnouncement);
    // eslint-disable-next-line no-underscore-dangle
    user.adverts.push(newAnnouncement._id);
    await user.save();
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "Bad create request";
    next(error);
  }
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
  getFavouriteAnnouncements,
  getMyAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
