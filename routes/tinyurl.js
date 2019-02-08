var express = require("express");
var routes = express.Router();

var controller = require('../controllers/tinyurlController');

routes.post("/shorten", controller.createTinyUrl);
routes.get("/longurl", controller.getLongUrl)

module.exports = routes;