// server.js
var Constants = require("./constants/const-values");

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var bodyParser = require('body-parser'); // use body parser module
var app = express(); // define our app using express

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || Constants.SERVER_PORT; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router
//TODO var RouterConfigurator = require()
//TODO https://github.com/shoaibuddin/nodejs-express-mongodb-api/blob/master/server.js


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({
    message: 'hooray! welcome to our api!'
  });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
