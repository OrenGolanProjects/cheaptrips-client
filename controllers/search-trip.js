// ==============================
// === Search Trip Controller ===
// ==============================

// Importing the cookie helper utility for managing cookies in the authentication process.
const cookieHelper = require('../utils/cookieHelper');
// Importing the GeneralAPIHandler class for making API requests to authenticate users.
const { GeneralAPIHandler } = require('../utils/API');
// Creating an instance of the GeneralAPIHandler class for handling API requests.
const apiHandler = new GeneralAPIHandler();


function formatDateToDDMM(inputDate) {
    // Parse the input date string into a Date object
    const date = new Date(inputDate);

    // Extract day and month components
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Return the formatted string "ddMM"
    return `${day}${month}`;
}

// GET route for rendering the search trip page
exports.getSearchTrip = (req, res, next) => {
    console.log('search-trip >> getSearchTrip :: start.');

    // Extracting cookies for authentication check
    const cookies = cookieHelper.extractCookies(req);

    // Checking if the user is authenticated
    if (cookies.isAuthenticated === 'true') {
        return res.render('./search-trip/search-trip', { 
            pageTitle: 'Search Trip',
            isAuthenticated: cookies.isAuthenticated
        });
    } else {
        console.log('search-trip >> getSearchTrip :: not authenticated, redirect to home.');
        return res.redirect("/");
    }
};

// POST route for handling search trip form submissions
exports.postSearchTrip = async (req, res, next) => {
    let userData = {};
    let tripResponse;
    let departureAt_ddMM;
    let returnAt_ddMM;
    
    try {
        console.log('search-trip >> postSearchTrip :: start.');

        // Fetch existing cookies
        const cookies = cookieHelper.extractCookies(req);


        // Assigning the origin and destination values from the /search-trips.
        const OriginCityNameString = req.body.origin;
        const DestinationCityNameString = req.body.destination;
        userData = {
            "origin_cityIATACode": '',
            "destination_cityIATACode": '',
            "destination_cityName": req.body.destination,
            "radius": req.body.radius * 1000,
            "limitPlaces": req.body.limitPlaces
        };

        console.log(req.body.departureDate);
        console.log(req.body.returnDate);

        // GET the cities data.
        if (!apiHandler.headers.has('Authorization')) {
            apiHandler.appendAuthorizationHeader(cookies.token);
        }
        const responseOrigin = await apiHandler.get(`cheap-trip/city-search?cityName=${OriginCityNameString}`);
        const responseDestination = await apiHandler.get(`cheap-trip/city-search?cityName=${DestinationCityNameString}`);

        // Validate if a city is not found.
        if (responseOrigin.length === 0) {
            console.log(responseOrigin);
            const status = responseOrigin.status;
            return res.status(status).render('error-page', {
                pageTitle: 'Error',
                error_header: 'Origin did not found!',
                error_description: status,
                isAuthenticated: cookies.isAuthenticated
            });
        }

        if (responseDestination.length === 0) {
            return res.render('error-page', {
                pageTitle: 'Error',
                error_header: 'Destination did not found!',
                error_description: (responseDestination),
                isAuthenticated: cookies.isAuthenticated
            });
        }

        // Activate modal for choosing the city.
        if (responseDestination.length > 1 || responseOrigin.length > 1) {
            console.log('search-trip >> postSearchTrip :: found more than one item..');

            console.log(userData);
            console.log('before render the next page - select city');

            return res.render('./search-trip/select-city', {
                pageTitle: 'Select City',
                isAuthenticated: cookies.isAuthenticated,
                originCity: JSON.stringify(responseOrigin),
                destinationCity: JSON.stringify(responseDestination),
                userData: JSON.stringify(userData),
                departureDate : req.body.departureDate,
                returnDate : req.body.returnDate
            });
        }

        // Setup the userData json to send in the request.
        userData = {
            "origin_cityIATACode": responseOrigin[0].cityIATACode,
            "destination_cityIATACode": responseDestination[0].cityIATACode,
            "destination_cityName": req.body.destination,
            "radius": req.body.radius,
            "limitPlaces": req.body.limitPlaces
        };

        console.log(userData);
        console.log('before execute the search trip api');




        if ((req.body.departureDate !== '' && req.body.departureDate !== null && req.body.departureDate !== undefined) &&
            (req.body.returnDate !== '' && req.body.returnDate !== null && req.body.returnDate !== undefined)
        ) {
            departureAt_ddMM = formatDateToDDMM(req.body.departureDate);
            returnAt_ddMM = formatDateToDDMM(req.body.returnDate);

            console.log('departureAt_ddMM: ',departureAt_ddMM,' returnAt_ddMM: ',returnAt_ddMM);

            console.log('start execute generate-trip-by-dates');
            tripResponse = await apiHandler.post(`cheap-trip/generate-trip-by-dates?depart_date=${req.body.departureDate}&return_date=${req.body.returnDate}`, userData);
            console.log('generate-trip-by-dates done successfully.');
        } else {
            departureAt_ddMM = formatDateToDDMM(new Date());    
            // Corrected the line to calculate returnAt_ddMM
            const today = new Date();
            returnAt_ddMM = formatDateToDDMM(new Date(today.setDate(today.getDate() + 3)));

            console.log('departureAt_ddMM: ',departureAt_ddMM,' returnAt_ddMM: ',returnAt_ddMM);

            console.log('start execute generate-monthly-trip');
            tripResponse = await apiHandler.post(`cheap-trip/generate-monthly-trip`, userData);
            console.log('generate-monthly-trip done successfully.');
        }

        console.log('search-trip >> postSearchTrip :: end.');
        return res.render('trip-page', {
            pageTitle: 'Search Trip Results',
            isAuthenticated: cookies.isAuthenticated,
            flightData: tripResponse.flight,
            newsData: tripResponse.news,
            travelPlacesData: tripResponse.placesData,
            returnDate: req.body.returnDate,
            departureDate: req.body.departureDate,
            departureAt_ddMM : departureAt_ddMM,
            returnAt_ddMM : returnAt_ddMM
        });
    } catch (error) {
        console.error(error);
        const cookies = cookieHelper.extractCookies(req);
        res.render('error-page', {
            pageTitle: 'Error',
            error_header: 'Search Trip Error!',
            error_description: error,
            isAuthenticated: cookies.isAuthenticated
        });
    }
};

// POST route for handling the selection of a city from the dropdown
exports.postSelectCity = async (req, res, next) => {
    let tripResponse;
    let departureAt_ddMM;
    let returnAt_ddMM;

    try {
        console.log('search-trip >> postSearchCity :: start.');
        const cookies = cookieHelper.extractCookies(req);
        const userData = JSON.parse(req.body.userData);

        userData.origin_cityIATACode = req.body.originSelect;
        userData.destination_cityIATACode = req.body.destinationSelect;
        console.log(`User Data after choosing a city :: `, userData);

        console.log(userData);
        console.log('before execute the search trip api');

        try{
                if ((req.body.departureDate !== '' && req.body.departureDate !== null && req.body.departureDate !== undefined) &&
                (req.body.returnDate !== '' && req.body.returnDate !== null && req.body.returnDate !== undefined)
            ) {
                departureAt_ddMM = formatDateToDDMM(req.body.departureDate);
                returnAt_ddMM = formatDateToDDMM(req.body.returnDate);

                console.log('departureAt_ddMM: ',departureAt_ddMM,' returnAt_ddMM: ',returnAt_ddMM);


                console.log('start execute generate-trip-by-dates');
                tripResponse = await apiHandler.post(`cheap-trip/generate-trip-by-dates?depart_date=${req.body.departureDate}&return_date=${req.body.returnDate}`, userData);
                console.log('generate-trip-by-dates done successfully.');
            } else {


                departureAt_ddMM = formatDateToDDMM(new Date());    
                // Corrected the line to calculate returnAt_ddMM
                const today = new Date();
                returnAt_ddMM = formatDateToDDMM(new Date(today.setDate(today.getDate() + 3)));

                console.log('departureAt_ddMM: ',departureAt_ddMM,' returnAt_ddMM: ',returnAt_ddMM);

                console.log('start execute generate-monthly-trip');
                tripResponse = await apiHandler.post(`cheap-trip/generate-monthly-trip`, userData);
                console.log('generate-monthly-trip done successfully.');
            }
        }catch{
            res.render('error-page', {
                pageTitle: 'Error',
                error_header: 'Search City Error!',
                error_description: `Did not found trip for ${req.body.destinationSelect} - ${userData.destination_cityName}, please try again.`,
                isAuthenticated: cookies.isAuthenticated
            });
        }

        console.log('search-trip >> postSearchCity :: end.');
        return res.render('trip-page', {
            pageTitle: 'Search Trip Results',
            isAuthenticated: cookies.isAuthenticated,
            flightData: tripResponse.flight,
            newsData: tripResponse.news,
            travelPlacesData: tripResponse.placesData,
            departureAt_ddMM : departureAt_ddMM,
            returnAt_ddMM : returnAt_ddMM
        });
    } catch (error) {
        const cookies = cookieHelper.extractCookies(req);
        res.render('error-page', {
            pageTitle: 'Error',
            error_header: 'Search City Error!',
            error_description: `Did not found trip, please try again..`,
            isAuthenticated: cookies.isAuthenticated
        });
    }
};
