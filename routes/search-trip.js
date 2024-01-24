// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const tripController = require('../controllers/search-trip');

// Get / Post route for search trip
routes.get('/search-trips',tripController.getSearchTrip);
routes.post('/search-trip',tripController.postSearchTrip);

// Get / Post route for selecting single city from the dropbox.
routes.post('/search-trip-select-city',tripController.postSelectCity)


module.exports.routes = routes;
