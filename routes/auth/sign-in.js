// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const userController = require('../../controllers/sign-in');

// "/" => GET
routes.get('/',userController.getSignInPage)
routes.get('/sign-in',)


// "/sign-in" => POST
routes.post('/sign-in',userController.postSignInPage)

exports.routes = routes;