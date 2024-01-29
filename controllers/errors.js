// ==============================
// === Error Controller ===
// ==============================

// Exported function to handle 404 errors
exports.get404Page = (err, req, res, next) => {
    // Check if the error is a 404 error
    if (err.status === 404) {
        // Render an error page template with the following data
        return res.status(404).render('error-page', {
            pageTitle: 'Page Not Found!',        // Title of the page
            error_header: 'Page Not Found!',      // Header message for the error
            error_description: '',                // Additional description for the error (currently empty)
            isAuthenticated: req.isAuthenticated  // Indicates whether the user is authenticated
        });
    }

    // If it's not a 404 error, pass the error to the next middleware
    next(err);
};
