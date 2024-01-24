// ==============================
// === User Settings Controller ===
// ==============================

// Importing the cookie helper utility for managing cookies in the authentication process.
const cookieHelper = require('../utils/cookieHelper');
// Importing the GeneralAPIHandler class for making API requests to authenticate users.
const { GeneralAPIHandler } = require('../utils/API');
// Creating an instance of the GeneralAPIHandler class for handling API requests.
const apiHandler = new GeneralAPIHandler();

// Handles GET request to display user settings.
exports.getUserDisplay = async (req, res, next) => {
    let userData = {};

    try {
        console.log('user-settings >> getUserDisplay :: start.');
        const cookies = cookieHelper.extractCookies(req);

        // Redirect to the home page if not authenticated.
        if (!(cookies.isAuthenticated === 'true')) {
            return res.redirect('/');
        }

        if ('userData' in cookies) {
            console.log('user-settings >> getUserDisplay :: userData in cookies.');
            // Parse JSON data from the cookie
            userData = JSON.parse(cookies.userData);
        } else {
            console.log('user-settings >> getUserDisplay :: execute get specific user.');
            console.log(cookies.token);

            apiHandler.appendAuthorizationHeader(cookies.token);
            const result = await apiHandler.get(`app/userinfo/get-specific-user-info`);

            console.log(result);

            userData = {
                "userName": result.userName,
                "firstName": result.firstName,
                "surName": result.surName,
                "email": result.email,
                "phone": result.phone
            };

            cookieHelper.setCookieWithExpire(res, 'userData', JSON.stringify(userData), 3600);
        }

        console.log('user-settings >> getUserDisplay :: end.');
        return res.render('user-settings', {
            pageTitle: 'Settings',
            userSettings: userData,
            isAuthenticated: cookies.isAuthenticated
        });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error in getUserDisplay:', error.message);
        return res.status(500).render('error-page', {
            pageTitle: 'Error',
            error_header: 'Internal Server Error',
            error_description: error.message,
            isAuthenticated: false
        });
    }
};

// Handles PUT request to update user information.
exports.putUpdateUser = async (req, res, next) => {
    let userData = {};

    try {
        console.log('user-settings >> putUpdateUser :: start.');
        const cookies = cookieHelper.extractCookies(req);

        // Redirect to the home page if not authenticated.
        if (!(cookies.isAuthenticated === 'true')) {
            return res.redirect('/');
        }

        userData = JSON.stringify({
            "userName": req.body.userName,
            "firstName": req.body.firstName,
            "surName": req.body.surname,
            "phone": req.body.phone
        });

        console.log(`user-settings >> putUpdateUser:: body: ${userData}`);

        // Uses the put method from GeneralAPIHandler to make an API request to update user information.
        const result = await apiHandler.put("app/userinfo/update-specific-user-info", JSON.parse(userData));
        console.log(`user-settings >> putUpdateUser:: Update successfully done.`);

        // Update the userData cookie with the new information.
        cookieHelper.setCookieWithExpire(res, 'userData', JSON.stringify(result), 3600);

        console.log('user-settings >> putUpdateUser :: end.');
        res.redirect('/user-settings');
    } catch (error) {
        // Handle errors appropriately
        console.error('Error in putUpdateUser:', error.message);
        return res.status(500).render('error-page', {
            pageTitle: 'Error',
            error_header: 'Update Details Failed!',
            error_description: error.message,
            isAuthenticated: false
        });
    }
};

// Handles DELETE request to delete user account.
exports.deleteUser = async (req, res, next) => {
    try {
        console.log('user-settings >> deleteUser :: start.');
        const cookies = cookieHelper.extractCookies(req);

        // Redirect to the home page if not authenticated.
        if (!(cookies.isAuthenticated === 'true')) {
            return res.redirect('/');
        }

        // Append Authorization header for the API request.
        if (!(apiHandler.headers.has('Authorization'))) {
            apiHandler.appendAuthorizationHeader(cookies.token);
        }

        // Use the delete method from GeneralAPIHandler to make an API request to delete user information.
        const result = await apiHandler.delete(`app/userinfo/delete-specific-user-info`);
        console.log('user-settings >> deleteUser :: end.');
    } catch (error) {
        // Handle errors appropriately
        console.error('Error in deleteUser:', error.message);
        return res.status(500).render('error-page', {
            pageTitle: 'Error',
            error_header: 'Delete User Failed!',
            error_description: error.message,
            isAuthenticated: false
        });
    }
};
