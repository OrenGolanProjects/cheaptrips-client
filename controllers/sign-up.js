// ==============================
// === Sign-Up Controller ===
// ==============================

// Importing the cookie helper utility for managing cookies in the authentication process.
const cookieHelper = require('../utils/cookieHelper');
// Importing the GeneralAPIHandler class for making API requests to authenticate users.
const { GeneralAPIHandler } = require('../utils/API');
// Creating an instance of the GeneralAPIHandler class for handling API requests.
const apiHandler = new GeneralAPIHandler();

// Handles GET request to get the sign-up page.
exports.getSignUpPage = (req, res, next) => {
    console.log('sign-up >> getSignUpPage:: start.');
    const cookies = cookieHelper.extractCookies(req);

    console.log(cookies);

    // Check if the user is already authenticated.
    if (cookies.isAuthenticated === 'true') {
        return res.status(400).render('error-page', {
            pageTitle: 'Sign-up error',
            error_header: "Cannot Sign-up!",
            error_description: 'Cannot sign-up while logged in, please logout first.',
            isAuthenticated: cookies.isAuthenticated
        });
    }

    // If the authentication status is not explicitly set to 'false', reset it.
    if (!(cookies.isAuthenticated === 'true')) {
        console.log('sign-up >> getSignUpPage:: isAuthenticated not true..');
        cookies.isAuthenticated = 'false';
    }

    console.log('sign-up >> getSignUpPage:: end.');
    
    // Render the sign-up page for non-authenticated users.
    return res.render('./auth/sign-up-page', { 
        pageTitle: 'Sign-up',
        isAuthenticated: cookies.isAuthenticated
    });
};

// Handles POST request after inserting email/pass to sign-up.
exports.postSignUpPage = async (req, res, next) => {
    console.log('sign-up >> postSignUpPage :: start.');

    // Check if the password and confirm_password match.
    if (req.body.password === req.body.confirm_password) {
        console.log("postSignUpPage BODDDYYY")
        console.log(req.body);

        // Converts the user's input into a JSON string.
        const raw = JSON.stringify(
            {
                "jwtRequest": {
                    "email": req.body.email,
                    "password": req.body.password
                },
                "userInfoRequest": {
                    "userName": req.body.userName,
                    "firstName": req.body.firstName,
                    "surName": req.body.surname,
                    "phone": req.body.phone
                }
            }
        );
        console.log(`sign-in >> postSignInPage:: body: ${raw}`);

        try {
            // Uses the post method from GeneralAPIHandler to make an API request for authentication.
            const result = await apiHandler.post("user", JSON.parse(raw));
            console.log(`sign-up >> postSignUpPage:: Sign-up successfully done.`);

            const maxAgeInSeconds = 5 * 60 * 60; // 5 hours in seconds
            cookieHelper.setCookieWithExpire(res, 'token', `${result.token}`, maxAgeInSeconds);
            cookieHelper.setCookieWithExpire(res, 'isAuthenticated', 'true', maxAgeInSeconds);
        } catch (error) {
            console.log(error);
            // Handles errors or sends an error response for invalid sign-up attempts.
            res.status(400).render('error-page', {
                pageTitle: 'Error in Sign-Up!',
                error_header: "User Already Exists!",
                error_description: 'Please try with a different email or sign in.',
                isAuthenticated: 'false'
            });
        }
    } else {
        // Passwords do not match, send an error response.
        res.status(400).render('error-page', {
            pageTitle: 'Invalid Password',
            error_header: "Invalid Password!",
            error_description: 'Passwords do not match, please try to sign-up again.',
            isAuthenticated: 'false'
        });
    }

    console.log('sign-up >> postSignUpPage :: end.');
    return res.redirect('/search-trips');
};
