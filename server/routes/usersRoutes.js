const express = require('express');

const { registerUser, loginUser } = require('../controllers/usersControllers');

const usersRoutes = express.Router();

usersRoutes.post('/register', registerUser);
usersRoutes.post('/login', loginUser);

module.exports = usersRoutes;
