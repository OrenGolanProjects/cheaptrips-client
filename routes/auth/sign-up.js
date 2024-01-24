// ==============================
// === Sign-Up Routes ===
// ==============================

// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const userController = require('../../controllers/sign-up');

// GET route for displaying the sign-up page
routes.get('/sign-up', userController.getSignUpPage);

// POST route for handling sign-up form submissions
routes.post('/sign-up', userController.postSignUpPage);

module.exports.routes = routes;