// ==============================
// === User Settings Controller ===
// ==============================

// Importing the cookie helper utility for managing cookies in the authentication process.
const cookieHelper = require('../utils/cookieHelper');
// Importing the GeneralAPIHandler class for making API requests to authenticate users.
const { GeneralAPIHandler } = require('../utils/API');
// Creating an instance of the GeneralAPIHandler class for handling API requests.
const apiHandler = new GeneralAPIHandler();
const mongodb = require('mongodb');
const User = require('../models/user');

const ObjectId = mongodb.ObjectId;

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

        console.log('user-settings >> getUserDisplay :: execute get specific user.');
        console.log(cookies.token);

        apiHandler.appendAuthorizationHeader(cookies.token);
        const result = await apiHandler.get(`app/userinfo/get-specific-user-info`); // create a new user in the backend app mongodb.
        const user = await User.findByEmail(result.email); // create a new user in the fronend app mongodb.
        console.log('User details from mongodb: ', user);


        console.log('user-settings >> getUserDisplay :: end.');
        return res.render('user-settings', {
            pageTitle: 'Settings',
            userSettings: user,
            isAuthenticated: cookies.isAuthenticated,
            req: req
        });
    } catch (error) {
        // Handle errors appropriately
        console.error('Error in getUserDisplay:', error.message);
        return res.status(500).render('error-page', {
            pageTitle: 'Error',
            error_header: 'Internal Server Error',
            error_description: error.message,
            isAuthenticated: false,
            req: req
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

        userData = ({
            "userName": req.body.userName,
            "firstName": req.body.firstName,
            "surName": req.body.surName,
            "phone": req.body.phone
        });

        console.log(`user-settings >> putUpdateUser:: body: `, userData);
        const result = await apiHandler.put("app/userinfo/update-specific-user-info", userData); // Update the user details in the backend app mongodb.
        console.log(`user-settings >> putUpdateUser:: Update successfully done.`);

        // Update the user details in the frontend app mongodb.
        const user = await User.findByEmail(result.email);
        const updateUser = new User(result.firstName, result.surName, result.phone, result.userName, user.email, user.password, new ObjectId(user._id));
        updateUser.save();

        console.log('user-settings >> putUpdateUser :: end.');
        res.redirect('/user-settings?success=update-successful');

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
        apiHandler.appendAuthorizationHeader(cookies.token);
        const user = await User.findByEmail(req.body.email);
        if (user) {
            await User.deleteById(user._id);
            console.log('User deleted successfully.');
        } else {
            console.log('User not found.', user._id);
        }




        // Use the delete method from GeneralAPIHandler to make an API request to delete user information.
        const result = await apiHandler.delete(`app/userinfo/delete-specific-user-info`);
        console.log('user-settings >> deleteUser :: end.');
        cookieHelper.clearCookies(req, res);
        res.redirect('/');
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
