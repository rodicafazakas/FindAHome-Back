const express = require('express');
const { getAnnouncements, getAnnouncementById } = require('../controllers/announcementsControllers');

const announcementsRoutes = express.Router();

announcementsRoutes.get('/', getAnnouncements);
announcementsRoutes.get('/idAnnouncement', getAnnouncementById);

module.exports = announcementsRoutes;
