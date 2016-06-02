'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Module = require('../../entities/module');

let PredefinedErrors = require('../../modules/predefined-errors');

let DeleteModule = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.moduleId == undefined) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Required parameter is not supplied. Please add 'moduleId'."));
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
        User.model.findByUser(req.body.user,
          function (foundUser) {
            return callback(null, foundUser);
          },
          function (error) {
            return callback(PredefinedErrors.getDatabaseOperationFailedError(error));
          }
        );
      },

      function (foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (apiKeyExpired) {
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
          user, RouteNames.MODULES, HttpVerbs.DELETE,
          function (error) {
            if (error) {
              /* In case user does not have permissions to access this resource */
              return callback(error);
            } else {
              return callback(null);
            }
          });
      },

      /* User has permission to delete the module at this point - authorized */

      function (callback) {

        Module.model.findOneAndRemove({moduleId: req.body.moduleId}, function (moduleRemoveError) {
          if (moduleRemoveError) {
            callback(PredefinedErrors.getDatabaseOperationFailedError(moduleRemoveError));
          } else {
            callback(null);
          }
        });
      },

      function (callback) {
        res.status(200);
        res.send();
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

module.exports = DeleteModule;