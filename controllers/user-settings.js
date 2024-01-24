
const cookieHelper = require('../utils/cookieHelper');  // Importing the cookie helper utility for managing cookies in the authentication process.
const { GeneralAPIHandler } = require('../utils/API');  // Importing the GeneralAPIHandler class for making API requests to authenticate users.
const apiHandler = new GeneralAPIHandler();             // Creating an instance of the GeneralAPIHandler class for handling API requests.


exports.getUserDisplay = async (req, res, next) => {
    let userData = {}; 
    try {
        console.log('user-settings >> getUserDisplay :: start.');
        const cookies = cookieHelper.extractCookies(req);

        if (!(cookies.isAuthenticated === 'true')) {
            return res.redirect('/');
        }

        if('userData' in cookies){
            console.log('user-settings >> getUserDisplay :: userData in cookies.');
            // Parse JSON data from the cookie
            userData = JSON.parse(cookies.userData)
        }else{
            console.log('user-settings >> getUserDisplay :: execute get specic user.');
            console.log(cookies.token);
            console.log(cookies.email);
            if (!(apiHandler.headers.has('Authorization'))){
                apiHandler.appendAuthorizationHeader(cookies.token);
            }
            
            const result = await apiHandler.get(`app/userinfo/get-specific-user-info?userIdentifier=${cookies.email}`);

            console.log(result)

            userData = {
                "userName": result.userName,
                "firstName": result.firstName,
                "surName": result.surName, 
                "email": result.email,
                "phone": result.phone
            }

            cookieHelper.setCookieWithExpire(res,'userData',JSON.stringify(userData),3600);
            

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
}

exports.putUpdateUser = async(req,res,next)=>{
    let userData = {};

    try{
        console.log('user-settings >> putUpdateUser :: start.');
        const cookies = cookieHelper.extractCookies(req);
    
        if (!(cookies.isAuthenticated === 'true')) {
            return res.redirect('/');
        }

        userData = JSON.stringify(
            {
                "userName": req.body.userName,
                "firstName": req.body.firstName,
                "surName": req.body.surname, 
                "phone": req.body.phone
            }
        );
        console.log(`user-settings >> putUpdateUser:: body: ${userData}`);

        // Uses the post method from GeneralAPIHandler to make an API request for authentication.
        const result = await apiHandler.put("app/userinfo/update-specific-user-info", JSON.parse(userData));
        console.log(`sign-up >> putUpdateUser:: Sign-up successfully done.`);


        cookieHelper.setCookieWithExpire(res,'userData',JSON.stringify(result),3600)
        
        console.log('user-settings >> putUpdateUser:: end.');
        res.redirect('/user-settings')
    }catch (error) {
        // Handle errors appropriately
        console.error('Error in getUserDisplay:', error.message);
        return res.status(500).render('error-page', {
            pageTitle: 'Error',
            error_header: 'Update Details Failed!',
            error_description: error.message,
            isAuthenticated: false
        });
    }
};

exports.deleteUser = async(req,res,next)=>{
    try{
    console.log('user-settings >> deleteUser :: start.');
    const cookies = cookieHelper.extractCookies(req);

    if (!(cookies.isAuthenticated === 'true')) {
        return res.redirect('/');
    }

    if (!(apiHandler.headers.has('Authorization'))){
        apiHandler.appendAuthorizationHeader(cookies.token);
    }
    const result = await apiHandler.delete(`app/userinfo/delete-specific-user-info`);
    console.log('user-settings >> deleteUser :: end.');
    
    } catch (error) {
        // Handle errors appropriately
        console.error('Error in getUserDisplay:', error.message);
        return res.status(500).render('error-page', {
            pageTitle: 'Error',
            error_header: 'Delete User Failed!',
            error_description: error.message,
            isAuthenticated: false
        });
    }
}