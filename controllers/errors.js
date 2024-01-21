
exports.get404Page = (req,res,next) =>{
    res.status(404).render('error-page',{
        pageTitle: 'Page Not Found!',
        error_header: "Page Not Found!",
        error_description:"",
        isAuthenticated: req.isAuthenticated
    });
    };
