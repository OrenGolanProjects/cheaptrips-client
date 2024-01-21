const cookieHelper = require('../utils/cookieHelper');  // Importing the cookie helper utility for managing cookies in the authentication process.
const { GeneralAPIHandler } = require('../utils/API');  // Importing the GeneralAPIHandler class for making API requests to authenticate users.
const apiHandler = new GeneralAPIHandler();             // Creating an instance of the GeneralAPIHandler class for handling API requests.


exports.getSearchTrip = (req,res,next) =>{
    console.log('search-trip >> getSearchTrip :: start.');
    const cookies = cookieHelper.extractCookies(req);
    console.log(`search-trip >> getSearchTrip :: authenticated: ${cookies.isAuthenticated}.`);

    if(cookies.isAuthenticated==='true'){
        return res.render('search-trip',{ pageTitle: 'search-trip',isAuthenticated: cookies.isAuthenticated});
    } else {
        console.log('search-trip >> getSearchTrip :: not authenticated, redirect to home.');
        return res.redirect("/");
    }
}