// ==============================
// === User Settings Routes ===
// ==============================

const express = require('express');
const routes = express.Router();
const userSettings = require('../controllers/user-settings');

// GET route for displaying the user settings page
routes.get('/user-settings', (req, res) => {
    // Pass the success message to the controller
    userSettings.getUserDisplay(req, res);
});

// POST route for handling user profile updates
routes.post('/user-update', (req, res) => {
    // Pass the success message to the controller
    userSettings.putUpdateUser(req, res);
});

// POST route for handling user account deletion
routes.post('/user-delete', (req, res) => {
    // Pass the success message to the controller
    userSettings.deleteUser(req, res);
});



module.exports.routes = routes;
