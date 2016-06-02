'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let PredefinedErrors = require('../../modules/predefined-errors');

let ListApiResources = (function () {

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
          function (userFindError) {
            return callback(PredefinedErrors.getDatabaseOperationFailedError(userFindError));
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
          user, RouteNames.API_RESOURCES, HttpVerbs.GET,
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
        let apiResources = [];
        for (let routeName in RouteNames) {
          if (RouteNames.hasOwnProperty(routeName)) {
            apiResources.push(RouteNames[routeName]);
          }
        }

        callback(null, apiResources)
      }

    ], function (err, apiResources) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(200);
        res.send(apiResources)
      }
    });

  };

  return {
    invoke: _invoke
  }
})();

module.exports = ListApiResources;