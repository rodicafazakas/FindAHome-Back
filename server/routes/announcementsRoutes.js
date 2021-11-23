const express = require('express');
const { 
  getAnnouncements, 
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementsControllers');

const announcementsRoutes = express.Router();

announcementsRoutes.get('/', getAnnouncements);
announcementsRoutes.get('/idAnnouncement', getAnnouncementById);
announcementsRoutes.post('/new', createAnnouncement);
announcementsRoutes.update('/idAnnouncement', updateAnnouncement);
announcementsRoutes.delete('/idAnnouncement', deleteAnnouncement);

module.exports = announcementsRoutes;
