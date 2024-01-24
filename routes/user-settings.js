// ==============================
// === User Settings Routes ===
// ==============================

// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const userSettings = require('../controllers/user-settings');

// GET route for displaying the user settings page
routes.get('/user-settings', userSettings.getUserDisplay);

// POST route for handling user profile updates
routes.post('/user-update', userSettings.putUpdateUser);

// POST route for handling user account deletion
routes.post('/user-delete', userSettings.deleteUser);

module.exports.routes = routes;
