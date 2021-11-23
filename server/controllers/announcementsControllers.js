const debug = require('debug')('file:server:announcementsControllers');
const chalk = require('chalk');

const Announcement = require('../../database/models/Announcement');

const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find();
  res.json(announcements);
};

const getAnnouncementById = async (req, res, next) => {
  const { idAnnouncement } = req.params;
  try {
    const searchedAnnouncement = await Announcement.findById(idAnnouncement);
    if (searchedAnnouncement) {
      res.json(searchedAnnouncement);
    } else {
      const error = new Error('Announcement not found');
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
  try {
    const newAnnouncement = await Announcement.create(req.body);
    res.status(200).json(newAnnouncement);
  } catch (error) {
    debug(chalk.red(error));
    next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  if (req.customerType !== "seller") {
    const error = new Error('Forbidden: only seller can update announcement');
    error.code = 403;
    next(error);
  }

  debug(chalk.yellow('Modify announcement at /announcements/idAnnouncement'));
  try {
    const announcement = req.body;
    debug(chalk.red(announcement.id));
    const announcementToUpdate = await Announcement.findByIdAndUpdate(announcement.id, announcement, {new: true});
    if (announcementToUpdate) {
      res.json(announcementToUpdate)
    } else {
      const error = new Error('Announcement not found');
      error.code = 404;
      next(error);
    }  
  } catch (error) {
    debug(chalk.red(error));
    error.code = 400;
    error.message = "Cannot update the announcement"
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  const { idAnnouncement } = req.params;
  try {
    const announcementToDelete = await Announcement.findByIdAndDelete(idAnnouncement);
    if (announcementToDelete) {
      res.json(announcementToDelete)
    } else {
      const error = new Error('Announcement not found');
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
  updateAnnouncement,
  deleteAnnouncement,
};
