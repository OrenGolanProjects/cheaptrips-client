const cookieHelper = require('../utils/cookieHelper');  // Importing the cookie helper utility for managing cookies in the authentication process.
const { GeneralAPIHandler } = require('../utils/API');  // Importing the GeneralAPIHandler class for making API requests to authenticate users.
const apiHandler = new GeneralAPIHandler();             // Creating an instance of the GeneralAPIHandler class for handling API requests.

const flight = require('../models/flight.js'); // Import the Flight model
const news = require('../models/news.js'); // Import the News model
const travelPlaces = require('../models/travel-places.js') // Import the Travel places model.
const trip = require('../models/trip.js'); // Import the Trip model


exports.getTripDisplay = (req, res, next) => {
    console.log('search-trip >> getSearchTrip :: start.');
    const cookies = cookieHelper.extractCookies(req);
    if(cookies.isAuthenticated==='true'){
        console.log(`search-trip >> getSearchTrip :: authenticated: ${cookies.isAuthenticated}.`);

        trip.fetchData((err, jsonData) => {
            if (err) {
                console.error('Error fetching trip data:', err);
                // Handle the error, e.g., render an error page
                return res.status(500).render('error', { error: 'Failed to fetch trip data' });
            }

            // Check if jsonData is defined
            if (!jsonData) {
                console.error('Trip data is undefined');
                // Handle the error, e.g., render an error page
                return res.status(500).render('error', { error: 'Trip data is undefined' });
            }

            // Use the data to create instances of Flight, News, and TravelPlaces
            const flightData = flight.fromJson(jsonData.flight);
            const newsData = news.fromJson(jsonData.news);
            const travelPlacesData = travelPlaces.fromJson(jsonData.placesData);


            console.log(flightData);
            // Render the trip-page.ejs with the tripData
            res.render('./trip/trip-page', { 
                pageTitle: 'Trip Results',
                flightData: flightData,
                newsData: newsData,
                travelPlacesData : travelPlacesData  
            });
        });
    }else {
        console.log('search-trip >> getSearchTrip :: not authenticated, redirect to home.');
        return res.redirect("/");
    }
};
