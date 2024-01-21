const cookie = require('cookie');

exports.extractCookies = function (req) {
    const cookieHeader = req.get('Cookie') || '';
    const cookies = cookie.parse(cookieHeader);
    return cookies;
};

exports.setCookieWithExpire = (res, name, value, expireTimeSeconds) => {
    console.log('cookieHelper >> setCookieWithExpire function.');

    // Get the existing cookies from the response header
    const existingCookies = res.getHeader('Set-Cookie') || [];

    // Create a new cookie and append it to the existing ones
    const updatedCookies = Array.isArray(existingCookies)
        ? [...existingCookies, cookie.serialize(name, value, { maxAge: expireTimeSeconds })]
        : [cookie.serialize(name, value, { maxAge: expireTimeSeconds })];


    // Set the updated cookies in the response header
    res.setHeader('Set-Cookie', updatedCookies);
};

exports.clearCookies = function (req, res) {
    // Get the existing cookies from the request headers
    const existingCookies = req.headers.cookie || '';

    // Split the cookie string into an array of key-value pairs
    const cookiesArray = existingCookies.split(';').map(cookieString => cookie.parse(cookieString.trim()));

    // Check if cookiesArray is not undefined or not iterable
    if (!Array.isArray(cookiesArray)) {
        return;
    }

    // Create a new array to store cookies with expired maxAge
    const expiredCookies = cookiesArray.map(cookieData => {
        const [cookieName] = Object.keys(cookieData);
        // Set maxAge to 1 second for each cookie
        return cookie.serialize(cookieName, '', { maxAge: 1 });
    });

    // Set the updated cookies with expired maxAge in the response header
    res.setHeader('Set-Cookie', expiredCookies);
};
