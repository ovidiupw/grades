'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Student = require('../../entities/student');

let PredefinedErrors = require('../../modules/predefined-errors');

let DeleteStudent = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.facultyIdentity == undefined) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Required parameter is not supplied. Please add 'facultyIdentity'."));
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
          user, RouteNames.STUDENTS, HttpVerbs.DELETE,
          function (error) {
            if (error) {
              /* In case user does not have permissions to access this resource */
              return callback(error);
            } else {
              return callback(null);
            }
          });
      },

      /* User has permission to access the resource at this point - authorized */

      function (callback) {

        Student.model.findOneAndRemove({facultyIdentity: req.body.facultyIdentity}, function (studentRemoveError) {
          if (studentRemoveError) {
            callback(PredefinedErrors.getDatabaseOperationFailedError(studentRemoveError));
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

module.exports = DeleteStudent;