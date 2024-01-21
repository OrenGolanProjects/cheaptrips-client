const cookieHelper = require('../utils/cookieHelper');  // Importing the cookie helper utility for managing cookies in the authentication process.
const { GeneralAPIHandler } = require('../utils/API');  // Importing the GeneralAPIHandler class for making API requests to authenticate users.
const apiHandler = new GeneralAPIHandler();             // Creating an instance of the GeneralAPIHandler class for handling API requests.


// '/' :: Handles a GET request to display the sign-in page.
exports.getSignInPage = (req, res, next) => {
        console.log('sign-in >> getSignInPage:: start.');

        // Extracts cookies from the request to check the user's authentication status.
        const cookies = cookieHelper.extractCookies(req);
        console.log('sign-in >> getSignInPage:: isAuthenticated value:', cookies.isAuthenticated);

        // If the user is already authenticated, redirects to the search-trips page.
        if (cookies.isAuthenticated === 'true') {
            console.log('sign-in >> getSignInPage:: isAuthenticated is true, redirecting to search-trips.');
            return res.redirect('/search-trips');
        };

        if(!(cookies.isAuthenticated === 'false')){
            cookies.isAuthenticated = 'false';
        }

        console.log('sign-in >> getSignInPage:: end.');
        // Renders the sign-in page for non-authenticated users.
        return res.render('./auth/sign-in-page', { 
            pageTitle: 'Sign-in',
            isAuthenticated: cookies.isAuthenticated
        });
    }

// Handles a POST request after submitting email and password for sign-in.
exports.postSignInPage = async (req, res, next) => {
    const cookies = cookieHelper.extractCookies(req);
    const maxAgeInSeconds = 5 * 60 * 60; // 5 hours in seconds
    try {
        console.log('ign-in >> postsSignInPage:: start');


        // Converts the user's input into a JSON string.
        const raw = JSON.stringify({"email": req.body.email, "password": req.body.password});
        console.log(`sign-in >> postSignInPage:: body: ${raw}`);

        // Uses the post method from GeneralAPIHandler to make an API request for authentication.
        const result = await apiHandler.post("authenticate", JSON.parse(raw));
        cookieHelper.setCookieWithExpire(res, 'email', decodeURIComponent(req.body.email), maxAgeInSeconds);

        try {
            apiHandler.appendAuthorizationHeader(result.token);
            result = await apiHandler.get(`app/userinfo/get-specific-user-info?userIdentifier=${req.body.email}`);
        }catch{
            return res.status(400).render('error-page', {
                pageTitle: 'Error in Sign-In!',
                error_header: "User Did Not Found!",
                error_description: 'Please Sign-Up.',
                isAuthenticated: 'false'
            });
        }

        // Sets cookies with authentication information for the user.
        
        
        cookieHelper.setCookieWithExpire(res, 'token', result.token, maxAgeInSeconds);
        cookieHelper.setCookieWithExpire(res, 'isAuthenticated', 'true', maxAgeInSeconds);
        console.log('sign-in >> postSignInPage:: end');
        // Sends a response to the client by rendering the search-trip page for authenticated users.
        res.redirect('/search-trips');

    } catch (error) {
        // Handles errors or sends an error response for invalid sign-in attempts.
        res.status(400).render('error-page', {
            pageTitle: 'Error in Sign-In!',
            error_header: "Invalid Inputs!",
            error_description: error.message,
            isAuthenticated: cookies.isAuthenticated
        });
    }
};
