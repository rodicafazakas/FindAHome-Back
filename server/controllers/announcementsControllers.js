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

module.exports = {
  getAnnouncements,
  getAnnouncementById,
};
