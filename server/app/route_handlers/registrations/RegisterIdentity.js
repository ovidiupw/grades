'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Registration = require('../../entities/registration');

let RegisterIdentity = {
  invoke: function (req, res, next) {
    async.waterfall([

      function (callback) {
        RequestValidator.validateRequest(
          req, RouteNames.REGISTER_IDENTITY, HttpVerbs.POST,
          function (error) {
            if (error) {
              callback(error);
            } else {
              callback(null);
            }
          });
      },

      function (callback) {
        User.model.findByUser(req.body.user,
          function (foundUser) {
            callback(null, foundUser);
          },
          function (error) {
            callback(error);
          }
        );
      },

      /* In case of success, the user has been found. */
      function (foundUser, callback) {
        let _err = false;
        RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (error) {
          if (error) {
            /* In case key expired, this will be executed */
            callback(error);
          } else {
            callback(null, foundUser);
          }
        });
      },

      /* Verify if the supplied identity exists in the database. */
      /* This is necessary because a user must have an identity in the
       database, with its associated roles, before it can use that identity.
       The identity MUST be created prior to user registration (association)
       with that identity. */
      function (foundUser, callback) {
        Registration.model.findByFacultyIdentity(
          req.body.facultyIdentity,
          function (foundRegistration) {
            callback(null, foundUser, foundRegistration);
          },
          function (error) {
            callback(error);
          }
        );
      },

      /* Api key is valid (not yet expired), so register a new identity with
       *  the user account, just don't confirm it yet. */
      function (foundUser, foundRegistration, callback) {
        let _err = false;

        if (foundUser.facultyIdentity == undefined) {
          User.model.addFacultyIdentity(foundUser._id, req.body.facultyIdentity,
            function (error) {
              /* There was an error updating faculty identity */
              callback(error);
              _err = true;
            });
        } else {
          User.model.updateFacultyIdentity(foundUser._id, req.body.facultyIdentity,
            function (error) {
              /* There was an error updating faculty identity */
              callback(error);
              _err = true;
            });
        }

        if (!_err) return callback(null, foundRegistration);
      },

      /* Associate an identity secret in order to verify identity by email */
      function (foundRegistration, callback) {
        foundRegistration.generateIdentitySecret(
          function (error) {
            if (error) {
              callback(error);
            }
          },
          function () { /* In case of successs */
            callback(null);
          }
        );
      },

      function (callback) {
        /* If it reaches this, the request succeeded. */
        res.status(200);
        res.send();
      }

    ], function (err, results) {
      if (err) {
        res.status(400);
        res.send(err);
      }
    });
  }
};

module.exports = RegisterIdentity;
