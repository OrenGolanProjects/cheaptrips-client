// ==============================
// === Error Controller ===
// ==============================

// Exported function to handle 404 errors
exports.get404Page = (req, res, next) => {
    // Set the HTTP status code to 404
    res.status(404).render('error-page', {
        // Render an error page template with the following data
        pageTitle: 'Page Not Found!',        // Title of the page
        error_header: 'Page Not Found!',      // Header message for the error
        error_description: '',                // Additional description for the error (currently empty)
        isAuthenticated: req.isAuthenticated  // Indicates whether the user is authenticated
    });
};
