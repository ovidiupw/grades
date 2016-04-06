// =======================
// get the packages we need ============
// =======================
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport    = require('passport');

var FacebookAuth = require('./app/config/facebook-auth');

// =======================
// configuration =========
// =======================
var port = process.env.PORT || 8082; // used to create, sign, and verify tokens

const DB = require('./app/config/database');
mongoose.connect(DB.PRODUCTION_DB); // connect to database

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(passport.initialize());
passport.use(FacebookAuth.facebookStrategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/* app.use(app.router) with passport */
require('./app/routes.js')(app, passport);

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Server running at http://localhost:' + port);
