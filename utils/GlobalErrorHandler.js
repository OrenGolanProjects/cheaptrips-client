// error-handler.js

exports.globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Set a default status code
    let statusCode = 500;

    // Check if the error has a status code
    if (err.status) {
        statusCode = err.status;
    }

    // Render an error page template with the following data
    res.status(statusCode).render('error-page', {
        pageTitle: 'Error',                      // Title of the page
        error_header: 'Something went wrong!',  // Header message for the error
        error_description: err.message || 'Internal Server Error',  // Additional description for the error
        isAuthenticated: req.isAuthenticated  // Indicates whether the user is authenticated
    });
};
