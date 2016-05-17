'use strict';

let User = require('./entities/user');

let RequestValidator = require('./modules/request-validator');
const RouteNames = require('./constants/routes');
const HttpVerbs = require('./constants/http-verbs');

const RegisterIdentity = require('./route_handlers/registrations/RegisterIdentity');
const AddNewRole = require('./route_handlers/roles/AddNewRole');

let Routes = function (app, passport) {

  app.get(RouteNames.ROOT, function (req, res) {
    let response = {
      'api_version': 'v1',
      'last_update_date': 'May 2016'
    };
    res.status(200);
    res.send(response);
  });

  app.post(RouteNames.REGISTRATIONS, function (req, res) {
    let _error = false;
    RequestValidator.validateRequest(
      req, RouteNames.REGISTRATIONS, HttpVerbs.POST,
      function (error) {

        res.status(400);
        res.send(error);
        _error = true;
      });
    if (_error) return;

    User.model.findByUser(req.body.user,
      function (foundUser) {
        RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (error) {
          /* In case key expired, this will be executed */
          res.status(400);
          res.send(error);
          _error = true;
        });
        if (_error) return;

        /* User credentials are valid at this point - authenticate */

        RequestValidator.validateAccessRights(
          foundUser, RouteNames.ROLES, HttpVerbs.POST,
          function (error) {
            /* In case user does not have permissions to access this resource */
            res.status(400);
            res.send(error);
            _error = true;
          });
      },
      function (err) {
        res.status(400);
        res.send(err);
        _error = true;
      }
    );
  });

  /**
   * This function handles adding a new role (specification) in the databse.
   */
  app.post(RouteNames.ROLES, function (req, res) {
    AddNewRole.invoke(req, res);
  });

  /**
   * This function handles registering a new faculty identity.
   */
  app.post(RouteNames.REGISTER_IDENTITY, function (req, res) {
    RegisterIdentity.invoke(req, res);
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
    function (req, res) {
      // Authentication succeeded, send auth data to user.
      res.status(200);
      res.send({
        profile: req.user
      });
    },
    function (err, req, res) {
      if (err) {
        // Authentication failed, send auth error data to user.
        res.status(400);
        res.send(err);
      }
    }
  );

  app.get("/", function (req, res) {
    res.status(404);
    res.send();
  });

};

module.exports = Routes;
