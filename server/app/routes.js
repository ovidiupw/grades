'use strict';

let User = require('./entities/user');
let RequestValidator = require('./modules/request-validator');
const RouteNames = require('./constants/routes');

let Routes = function(app, passport) {

  app.get(RouteNames.ROOT, function(req, res) {
    res.send('This is the homepage. Send a request to' + '/auth/facebook to authenticate.');
  });

  app.post(RouteNames.REGISTER_IDENTITY, function(req, res) {
    RequestValidator.validateRequest(req, RouteNames.REGISTER_IDENTITY, function(error) {
      res.status(400);
      res.send(error);
    });

    User.model.findByUser(req.body.user,
      function(foundUser) {

        /* In case of success, the user has been found. */
        RequestValidator.validateApiKey(foundUser, req.body.apiKey, function(error) {
          /* In case key expired, this will be executed */
          res.status(400);
          res.send(error);
        });

        /* Api key is valid (not yet expired), so register a new identity with
         *  the user account, just don't confirm it yet. */

        if (foundUser.facultyIdentity == undefined) {
          User.model.addFacultyIdentity(foundUser._id, req.body.facultyIdentity, function(error) {
            /* There was an error updating faculty identity */
            res.status(400);
            res.send(error);
          });

        } else {
          User.model.updateFacultyIdentity(foundUser._id, req.body.facultyIdentity, function(error) {
            /* There was an error updating faculty identity */
            res.status(400);
            res.send(error);
          });
        }

        foundUser.facultyIdentity = req.body.facultyIdentity;
        res.status(200);
        res.end();
      },
      function(error) {
        /* In case of failure */
        res.status(400);
        res.send(error);
      }
    );
  });

  /* Authentication via facebook */

  app.get(RouteNames.AUTH_FACEBOOK,
    passport.authenticate('facebook', {
      authType: 'rerequest',
      session: false
    })
  );

  app.get(RouteNames.AUTH_FACEBOOK_CALLBACK,
    passport.authenticate('facebook'),
    function(req, res) {
      // Authentication succeeded, send auth data to user.
      res.status(200);
      res.send({
        profile: req.user
      });
    },
    function(err, req, res, next) {
      if (err) {
        // Authentication failed, send auth error data to user.
        res.status(400);
        res.send(err);
      }
    }
  );
};

module.exports = Routes;
