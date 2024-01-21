// Importing the 'express' library to create a web server
const express = require('express');
const routes = express.Router();
const logoutControler = require('../../controllers/log-out');

routes.post('/logout',logoutControler.postLogout)

exports.routes = routes;