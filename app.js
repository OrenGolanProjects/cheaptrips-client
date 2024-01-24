// ======== 3rd party imports ===========
// ======================================
const express = require('express');             // Importing the 'express' library to create a web server
const bodyParser = require('body-parser');      // Importing the 'body-parser' middleware to handle HTTP request bodies
const path = require('path');
const session = require('express-session');

// ============ CONTROLER ===============
// ======================================
const errorController = require('./controllers/errors');

// =============== ROUTES ===============
// ======================================
const signInRoutes  = require('./routes/auth/sign-in');
const signUpRoutes  = require('./routes/auth/sign-up');
const logOutRoutes  = require('./routes/auth/log-out');
const userSettingsRoutes    = require('./routes/user-settings');
const searchTripRoutes      = require('./routes/search-trip');


// ============ EXPRESS APP =============
// ======================================
const app = express(); // Creating an instance of the Express application

app.set('view engine', 'ejs'); // configure the view engine into EJS tamplting engine for using html.
app.set('views','views');     // configure the path of the views.


// ============ MIDDELWARE ==============
// ======================================
app.use(bodyParser.urlencoded({extended: false})); // Configuring the 'body-parser' middleware to parse URL-encoded data
app.use(express.static(path.join(__dirname,'public'))); // configure the folder public to handle the style.css file.

// ============ USER ROUTES ================
app.use(signInRoutes.routes);           // Manage the routes to login page to start with '/'.
app.use(signUpRoutes.routes);           // Manage the routes to sign up page to start with '/sign-up'.
app.use(logOutRoutes.routes);           // Manage the routes for the user.
app.use(userSettingsRoutes.routes);     // Manage the routes for the user.

// ============ TRIP ROUTES ================
app.use(searchTripRoutes.routes);       // Manage the routes for search a trip.


// ============ ERROR ================
app.use(errorController.get404Page); // activate from controller the Page not found error.


// =============== LISTENER =============
// ======================================
app.listen(8080);       // Setting up a basic HTTP server to listen on port 8080
console.log('Local host: http://localhost:8080/')
