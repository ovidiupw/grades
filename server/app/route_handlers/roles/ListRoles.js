'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Role = require('../../entities/role');

let PredefinedErrors = require('../../modules/predefined-errors');
let PredefinedRoles = require('../../constants/roles');

let ListRoles = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.headerIsValid(req.headers)) {
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
        User.model.findByUser(req.headers['user'],
          function (foundUser) {
            return callback(null, foundUser);
          },
          function (error) {
            return callback(PredefinedErrors.getDatabaseOperationFailedError(error));
          }
        );
      },

      function (foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.headers['apikey'], function (apiKeyExpired) {
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
          user, RouteNames.ROLES, HttpVerbs.GET,
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
        Role.model.find({}, function (err, roles) {
          if (err) {
            return callback(err);
          } else {
            return callback(null, roles);
          }
        });
      },

      function(roles, callback) {
        for (let predefinedRole in PredefinedRoles) {
          if (PredefinedRoles.hasOwnProperty(predefinedRole)) {
            roles.push(PredefinedRoles[predefinedRole]);
          }
        }
        callback(null, roles);
      },

      function (roles, callback) {
        res.status(200);
        res.send(roles);
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

module.exports = ListRoles;