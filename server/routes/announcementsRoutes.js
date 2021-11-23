const express = require('express');
const auth = require('../middlewares/auth');
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
announcementsRoutes.post('/new', auth, createAnnouncement);
announcementsRoutes.put('/idAnnouncement', auth, updateAnnouncement);
announcementsRoutes.delete('/idAnnouncement', auth, deleteAnnouncement);

module.exports = announcementsRoutes;
