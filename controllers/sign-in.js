// ==============================
// === Sign-In Controller ===
// ==============================

// Importing the cookie helper utility for managing cookies in the authentication process.
const cookieHelper = require('../utils/cookieHelper');
// Importing the GeneralAPIHandler class for making API requests to authenticate users.
const { GeneralAPIHandler } = require('../utils/API');
// Creating an instance of the GeneralAPIHandler class for handling API requests.
const apiHandler = new GeneralAPIHandler();

// Handles a GET request to display the sign-in page.
exports.getSignInPage = (req, res, next) => {
    console.log('sign-in >> getSignInPage:: start.');

    // Extracts cookies from the request to check the user's authentication status.
    const cookies = cookieHelper.extractCookies(req);
    console.log('sign-in >> getSignInPage:: isAuthenticated value:', cookies.isAuthenticated);

    // If the user is already authenticated, redirects to the search-trips page.
    if (cookies.isAuthenticated === 'true') {
        console.log('sign-in >> getSignInPage:: isAuthenticated is true, redirecting to search-trips.');
        return res.redirect('/search-trips');
    }

    // Resets the authentication status if it is not explicitly set to 'false'.
    if (!(cookies.isAuthenticated === 'false')) {
        cookies.isAuthenticated = 'false';
    }

    console.log('sign-in >> getSignInPage:: end.');

    // Renders the sign-in page for non-authenticated users.
    return res.render('./auth/sign-in-page', { 
        pageTitle: 'Sign-in',
        isAuthenticated: cookies.isAuthenticated
    });
};

// Handles a POST request after submitting email and password for sign-in.
exports.postSignInPage = async (req, res, next) => {
    const cookies = cookieHelper.extractCookies(req);
    const maxAgeInSeconds = 5 * 60 * 60; // 5 hours in seconds

    try {
        console.log('sign-in >> postSignInPage:: start');
        console.log(`sign-in >> postSignInPage:: body: ${{"email": req.body.email, "password": req.body.password}}`);

        const raw = JSON.stringify({"email": req.body.email, "password": req.body.password});

        try {
            // Uses the post method from GeneralAPIHandler to make an API request for authentication.
            const result = await apiHandler.post("authenticate", JSON.parse(raw));
            // cookieHelper.setCookieWithExpire(res, 'email', decodeURIComponent(req.body.email), maxAgeInSeconds);
            cookieHelper.setCookieWithExpire(res, 'token', result.token, maxAgeInSeconds);

            if (!(apiHandler.headers.has('Authorization'))){
                apiHandler.appendAuthorizationHeader(result.token);
            }
            await apiHandler.get(`app/userinfo/get-specific-user-info?userIdentifier=${decodeURIComponent(req.body.email)}`);
        } catch (error) {
            console.log(error);
            return res.status(400).render('error-page', {
                pageTitle: 'Error in Sign-In!',
                error_header: "User Not Found!",
                error_description: 'Please Sign-Up.',
                isAuthenticated: 'false'
            });
        }

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
