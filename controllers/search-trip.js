const cookieHelper = require('../utils/cookieHelper');  // Importing the cookie helper utility for managing cookies in the authentication process.
const { GeneralAPIHandler } = require('../utils/API');  // Importing the GeneralAPIHandler class for making API requests to authenticate users.
const apiHandler = new GeneralAPIHandler();             // Creating an instance of the GeneralAPIHandler class for handling API requests.


exports.getSearchTrip = (req,res,next) =>{

    console.log('search-trip >> getSearchTrip :: start.');
    const cookies = cookieHelper.extractCookies(req);

    if(cookies.isAuthenticated==='true'){
        return res.render('./search-trip/search-trip',{ 
            pageTitle: 'search-trip',
            isAuthenticated: cookies.isAuthenticated
        });
    } else {
        console.log('search-trip >> getSearchTrip :: not authenticated, redirect to home.');
        return res.redirect("/");
    }
};

exports.postSearchTrip = async(req,res,next)=>{
    let userData = {};
    let tripResponse;
    try{
        console.log('search-trip >> postSearchTrip :: start.');
        // fetch existing cookies.
        const cookies = cookieHelper.extractCookies(req);

        // assign the origin and destination values from the /search-trips.
        const OriginCityNameString = (req.body.origin);
        const DestinationCityNameString = (req.body.destination);
        userData = {
            "origin_cityIATACode": '',
            "destination_cityIATACode": '',
            "destination_cityName": req.body.destination,
            "radius": (req.body.radius*1000),
            "limitPlaces": req.body.limitPlaces
        };

        console.log(req.body.departureDate);
        console.log(req.body.returnDate);

        // GET the cities data.
        if (!(apiHandler.headers.has('Authorization'))){
            apiHandler.appendAuthorizationHeader(cookies.token);
        }
        const responseOrigin = await apiHandler.get(`cheap-trip/city-search?cityName=${OriginCityNameString}`);
        const responseDestination = await apiHandler.get(`cheap-trip/city-search?cityName=${DestinationCityNameString}`);


        // Validate if a city not found.
        if(responseOrigin.length===0){
            console.log(responseOrigin);
            const status = responseOrigin.status;
            return res.status(status).render('error-page', {
                pageTitle: 'Error',
                error_header: 'Invalid Origin!',
                error_description: status,
                isAuthenticated: cookies.isAuthenticated
            });
        };

        if(responseDestination.length===0){
            const status = responseDestination.status;
            return res.status(status).render('error-page', {
                pageTitle: 'Error',
                error_header: 'Invalid Destination!',
                error_description: (status,errorText) ,
                isAuthenticated: cookies.isAuthenticated
            });
        };

        // activating modal for choose the city.
        if(responseDestination.length>1 || responseOrigin.length>1){
            console.log('search-trip >> postSearchTrip :: found more then one item..');


            console.log(userData);
            console.log('before render the next page - select city');

            return res.render('./search-trip/select-city',{ 
                pageTitle: 'Select City',
                isAuthenticated: cookies.isAuthenticated,
                originCity  : JSON.stringify(responseOrigin),
                destinationCity : JSON.stringify(responseDestination),
                userData : JSON.stringify(userData)
            });
        };

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
        
        if  (   (req.body.departureDate !== '' && req.body.departureDate !== null && req.body.departureDate !== undefined) &&
                (req.body.returnDate !== '' && req.body.returnDate !== null && req.body.returnDate !== undefined)
            )
        {
            console.log('start execute generate-trip-by-dates');
            tripResponse = await apiHandler.post(`cheap-trip/generate-trip-by-dates?depart_date=${req.body.departureDate}&return_date=${req.body.returnDate}`,userData);
            console.log('generate-trip-by-dates done succesfully.');
        } else{
            console.log('start execute generate-monthly-trip')
            tripResponse = await apiHandler.post(`cheap-trip/generate-monthly-trip`,userData);
            console.log('generate-monthly-trip done succesfully.');
        }

        console.log('search-trip >> postSearchTrip :: end.');
        return res.render('trip-page',{ 
            pageTitle: 'Select City',
            isAuthenticated: cookies.isAuthenticated,
            flightData : tripResponse.flight,
            newsData : tripResponse.news,
            travelPlacesData : tripResponse.placesData,
            returnDate : req.body.returnDate,
            departureDate : req.body.departureDate
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
    };
};


exports.postSelectCity = async (req,res,next) =>{
    let tripResponse;
    try{
        console.log('search-trip >> postSearchCity :: start.');
        const cookies = cookieHelper.extractCookies(req);
        const userData = JSON.parse(req.body.userData);

        userData.origin_cityIATACode = req.body.originSelect;
        userData.destination_cityIATACode = req.body.destinationSelect;
        console.log(`User Data after choose a city :: `,userData);

        console.log(userData);
        console.log('before execute the search trip api');

        if  (   (req.body.departureDate !== '' && req.body.departureDate !== null && req.body.departureDate !== undefined) &&
                (req.body.returnDate !== '' && req.body.returnDate !== null && req.body.returnDate !== undefined)
            )
        {
            console.log('start execute generate-trip-by-dates');
            tripResponse = await apiHandler.post(`cheap-trip/generate-trip-by-dates?depart_date=${req.body.departureDate}&return_date=${req.body.returnDate}`,userData);
            console.log('generate-trip-by-dates done succesfully.');
        }else{
            console.log('start execute generate-monthly-trip')
            tripResponse = await apiHandler.post(`cheap-trip/generate-monthly-trip`,userData);
            console.log('generate-monthly-trip done succesfully.');
        }

        console.log('search-trip >> postSearchCity :: end.');
        return res.render('trip-page',{ 
            pageTitle: 'Select City',
            isAuthenticated: cookies.isAuthenticated,
            flightData : tripResponse.flight,
            newsData : tripResponse.news,
            travelPlacesData : tripResponse.placesData
        });

    } catch (error) {
        console.error(error);
        const cookies = cookieHelper.extractCookies(req);
        res.render('error-page', {
            pageTitle: 'Error',
            error_header: 'Search City Error!',
            error_description: error,
            isAuthenticated: cookies.isAuthenticated
        });
    };
};