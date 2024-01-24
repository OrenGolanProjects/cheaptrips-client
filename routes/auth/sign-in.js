// ==============================
// === Sign-In Routes ===
// ==============================

// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const userController = require('../../controllers/sign-in');

// GET route for displaying the sign-in page
routes.get('/', userController.getSignInPage);

// POST route for handling sign-in form submissions
routes.post('/sign-in', userController.postSignInPage);

module.exports.routes = routes;