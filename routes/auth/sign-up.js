// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const userController = require('../../controllers/sign-up');


// /sign-up => GET
routes.get('/sign-up',userController.getSignUpPage)

routes.post('/sign-up',userController.postSignUpPage)

module.exports.routes = routes;