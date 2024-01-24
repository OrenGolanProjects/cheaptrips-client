// ==============================
// === Log-Out Routes ===
// ==============================

// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const logoutController = require('../../controllers/log-out');

// POST route for handling user logout
routes.post('/logout', logoutController.postLogout);

module.exports.routes = routes;
