// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const tripController = require('../controllers/trip');

// /trip-result => GET
routes.get('/trip-result',tripController.getTripDisplay);


module.exports.routes = routes;
