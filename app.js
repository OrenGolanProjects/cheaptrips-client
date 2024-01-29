// ==============================
// === Travel App Server ===
// ==============================

// ======== 3rd party imports ===========
const express = require('express');             // Importing the 'express' library to create a web server
const bodyParser = require('body-parser');      // Importing the 'body-parser' middleware to handle HTTP request bodies
const path = require('path');
const { mongoConnect, getDb } = require('./utils/database'); // Adjust the path accordingly
const { globalErrorHandler } = require('./utils/GlobalErrorHandler'); // Adjust the path accordingly


// ============ CONTROLLER ===============
const errorController = require('./controllers/errors');


// =============== ROUTES ===============
const signInRoutes = require('./routes/auth/sign-in');
const signUpRoutes = require('./routes/auth/sign-up');
const logOutRoutes = require('./routes/auth/log-out');
const userSettingsRoutes = require('./routes/user-settings');
const searchTripRoutes = require('./routes/search-trip');

// ============ EXPRESS APP =============
const app = express(); // Creating an instance of the Express application

app.set('view engine', 'ejs'); // Configuring the view engine into EJS templating engine for using HTML.
app.set('views', 'views');     // Configuring the path of the views.

// ============ MIDDLEWARE ==============
app.use(bodyParser.urlencoded({ extended: false })); // Configuring the 'body-parser' middleware to parse URL-encoded data
app.use(express.static(path.join(__dirname, 'public'))); // Configuring the 'public' folder to handle the 'style.css' file.


// ============ USER ROUTES ================
app.use(signInRoutes.routes);           // Managing the routes for the login page, starting with '/'.
app.use(signUpRoutes.routes);           // Managing the routes for the sign-up page, starting with '/sign-up'.
app.use(logOutRoutes.routes);           // Managing the routes for user actions.
app.use(userSettingsRoutes.routes);     // Managing the routes for user settings.

// ============ TRIP ROUTES ================
app.use(searchTripRoutes.routes);       // Managing the routes for searching a trip.

// ============ ERROR ================
app.use(errorController.get404Page);    // Activating the Page Not Found error from the controller.
app.use(globalErrorHandler); // Add the global error handler



// =============== LISTENER =============
// Connect to MongoDB
mongoConnect(client => {
    const server = app.listen(process.env.PORT || 8080, () => {
        const port = server.address().port;
        console.log(`Server is running at http://localhost:${port}/`);
    });
});
