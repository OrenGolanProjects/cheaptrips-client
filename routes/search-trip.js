// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const tripController = require('../controllers/search-trip');

// /trip-result => GET
routes.get('/search-trips',tripController.getSearchTrip);


module.exports.routes = routes;
