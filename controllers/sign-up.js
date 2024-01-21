const cookieHelper = require('../utils/cookieHelper');  // Importing the cookie helper utility for managing cookies in the authentication process.
const { GeneralAPIHandler } = require('../utils/API');  // Importing the GeneralAPIHandler class for making API requests to authenticate users.
const apiHandler = new GeneralAPIHandler();             // Creating an instance of the GeneralAPIHandler class for handling API requests.

// handles get request to get the homepage that is sign-in.
exports.getSignUpPage = (req,res,next) => {
    console.log('sign-up >> getSignUpPage:: start.');
    const cookies = cookieHelper.extractCookies(req);

    console.log(cookies);

    if((cookies.isAuthenticated === 'true')){
        return res.status(400).render('error-page', {
            pageTitle: 'Sign-up error',
            error_header: "Cannot Sign-up!",
            error_description: 'Cannot sign-up while logged in, please logout first.',
            isAuthenticated: cookies.isAuthenticated
        });
    }

    if(!(cookies.isAuthenticated === 'true')){
        console.log('sign-up >> getSignUpPage:: isAuthenticated not true..');
        cookies.isAuthenticated = 'false';
    }

    console.log('sign-up >> getSignUpPage:: end.');
    return res.render('./auth/sign-up-page',{ 
        pageTitle: 'Sign-up',
        isAuthenticated: cookies.isAuthenticated
    });

}

// handles post request after insert email/pass to sign-in.
exports.postSignUpPage = async (req,res,next) =>{
        console.log('sign-up >> postSignUpPage :: start.');

        if(req.body.password===req.body.confirm_password){
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
                    "surName": req.body.surName, 
                    "phone": req.body.phone
                }
            }
        );
        console.log(`sign-in >> postSignInPage:: body: ${raw}`);

        // Uses the post method from GeneralAPIHandler to make an API request for authentication.
        const result = await apiHandler.post("user", JSON.parse(raw));
        console.log(`sign-up >> postSignUpPage:: Sign-up successfully done.`);

        const maxAgeInSeconds = 5 * 60 * 60; // 5 hours in seconds
        cookieHelper.setCookieWithExpire(res, 'token', `${result.token}`, maxAgeInSeconds);
        cookieHelper.setCookieWithExpire(res, 'isAuthenticated', 'true', maxAgeInSeconds);
        }
        else{
                // Handles errors or sends an error response for invalid sign-in attempts.
                res.status(400).render('error-page', {
                    pageTitle: 'Invalid Password',
                    error_header: "Invalid Password!",
                    error_description: 'Password are not the same, please try to sign-up again.',
                    isAuthenticated: 'false'
                });
        }

        console.log('sign-up >> postSignUpPage :: end.');
        return res.redirect('/search-trips');
    }