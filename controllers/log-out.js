// ==============================
// === Log-Out Controller ===
// ==============================

// Importing a module that provides helper functions for handling cookies
const cookieHelper = require('../utils/cookieHelper');

// Exported function to handle POST requests for user logout
exports.postLogout = (req, res, next) => {
    console.log('log-out >> postLogout:: start.');

    // Clear cookies using a helper function from the imported module
    cookieHelper.clearCookies(req, res);

    // Log the end of the logout process
    console.log('log-out >> postLogout:: end.');

    // Redirect the user to the home page after logout
    return res.redirect('/');
};
