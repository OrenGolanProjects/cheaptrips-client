const cookieHelper = require('../utils/cookieHelper');


exports.postLogout = (req, res, next) => {
    console.log('log-out >> postLogout:: start.');

    // Clear cookies when logging out
    cookieHelper.clearCookies(req,res);

    console.log('log-out >> postLogout:: end.');
    return res.redirect('/');
};


