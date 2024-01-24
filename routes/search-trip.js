// ==============================
// === Search Trip Routes ===
// ==============================

// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const tripController = require('../controllers/search-trip');

// GET and POST routes for searching trips
routes.get('/search-trips', tripController.getSearchTrip);
routes.post('/search-trip', tripController.postSearchTrip);

// POST route for selecting a single city from the dropdown
routes.post('/search-trip-select-city', tripController.postSelectCity);

module.exports.routes = routes;
