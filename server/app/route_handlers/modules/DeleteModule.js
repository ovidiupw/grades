'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Course = require('../../entities/course');
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

      return errCallback(null, req);
    });
  };

  let _findUser = function (req, callback) {
    User.model.findByUser(req.body.user,
      function (foundUser) {
        return callback(null, req, foundUser);
      },
      function (userFindError) {
        return callback(userFindError);
      }
    );
  };

  let _validateApiKey = function (req, foundUser, callback) {
    RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (apiKeyExpired) {
      if (apiKeyExpired) {
        return callback(apiKeyExpired);
      } else {
        return callback(null, req, foundUser);
      }
    });
  };

  let _validateAccessRights = function (req, user, callback) {
    RequestValidator.validateAccessRights(
      user, RouteNames.MODULES, HttpVerbs.DELETE,
      function (error) {
        if (error) {
          /* In case user does not have permissions to access this resource */
          return callback(error);
        } else {
          return callback(null, req);
        }
      });
  };

  let _deleteModule = function (req, callback) {
    Module.model.findOneAndRemove({
      moduleId: req.body.moduleId
    }, function (moduleRemoveErr) {
      if (moduleRemoveErr) {
        callback(PredefinedErrors.getDatabaseOperationFailedError(moduleRemoveErr));
      } else {
        callback(null);
      }
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

      _validateApiKey,

      /* User credentials are valid at this point - authentication succeeded */
      /* Now verify user access rights - authorization step */

      _validateAccessRights,

      /* User has permission to delete the module at this point - authorized */

      _deleteModule,

      function (callback) {
        let module = {moduleId: req.body.moduleId};
        Course.model.update({courseId: req.body.courseId}, {$pull: {modules: module}},
          function (courseUpdateError) {
            if (courseUpdateError) {
              return callback(PredefinedErrors.getDatabaseOperationFailedError(courseUpdateError));
            } else {
              Course.model.findOne({courseId: req.body.courseId},
                function (courseNotFoundErr, foundCourse) {
                  if (courseNotFoundErr || foundCourse == null) {
                    return callback(PredefinedErrors.getDatabaseOperationFailedError(courseNotFoundErr));
                  }
                  if (foundCourse.evaluation == req.body.moduleId) {
                    Course.model.update({courseId: req.body.courseId}, {$set: {evaluation: "undefined"}},
                      {upsert: true}, function (err) {
                      });
                  }
                  return callback(null);
                });

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
    invoke: _invoke,
    validateRequest: _validateRequest,
    validateApiKey: _validateApiKey,
    validateAccessRights: _validateAccessRights,
    deleteModule: _deleteModule
  }
})();

module.exports = DeleteModule;