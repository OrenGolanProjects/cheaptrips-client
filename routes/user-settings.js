// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const userSettings = require('../controllers/user-settings');

// /user-settings => GET
routes.get('/user-settings',userSettings.getUserDisplay);
routes.post('/user-update',userSettings.putUpdateUser);
routes.post('/user-delete',userSettings.deleteUser);

module.exports.routes = routes;
