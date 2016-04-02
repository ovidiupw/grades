// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./app/user');
    
// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8082; // used to create, sign, and verify tokens
mongoose.connect('mongodb://localhost:27017/GradesDatabase'); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! Create a new account at http://localhost:' + port + '/accounts/new');
});

// API ROUTES -------------------
app.post('/accounts/new', function(req, res) {
  res.send('Here you will create a new account.');
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);