'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Registration = require('../../entities/registration');

let PredefinedErrors = require('../../modules/predefined-errors');

let ListRegistrations = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.headerIsValid(req.header)) {
        return errCallback(PredefinedErrors.getInvalidHeaderError());
      }
      if (!RequestValidator.requestHeaderContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }

      return errCallback(null);
    });
  };

  let _invoke = function (req, res) {
    async.waterfall([

      function (callback) {
        _validateRequest(req, function (invalidRequestError) {
          if (invalidRequestError) {
            return callback(invalidRequestError);
          } else {
            return callback(null);
          }
        });
      },

      function (callback) {
        User.model.findByUser(req.header.user,
          function (foundUser) {
            return callback(null, foundUser);
          },
          function (error) {
            return callback(PredefinedErrors.getDatabaseOperationFailedError(error));
          }
        );
      },

      function (foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.header.apiKey, function (apiKeyExpired) {
          if (apiKeyExpired) {
            return callback(apiKeyExpired);
          } else {
            return callback(null, foundUser);
          }
        });
      },

      /* User credentials are valid at this point - authentication succeeded */
      /* Now verify user access rights - authorization step */

      function (user, callback) {
        RequestValidator.validateAccessRights(
          user, RouteNames.REGISTRATIONS, HttpVerbs.GET,
          function (error) {
            if (error) {
              /* In case user does not have permissions to access this resource */
              return callback(error);
            } else {
              return callback(null);
            }
          });
      },

      function (callback) {
        Registration.model.find({}, function (err, registrations) {
          if (err) {
            return callback(err);
          } else {
            return callback(null, registrations);
          }
        });
      },

      function (registrations, callback) {
        res.status(200);
        res.send(registrations);
      }

    ], function (err, results) {
      if (err) {
        res.status(400);
        res.send(err);
      }
    });

  };

  return {
    invoke: _invoke
  }
})();

module.exports = ListRegistrations;