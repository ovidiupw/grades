'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Student = require('../../entities/registration');

let PredefinedErrors = require('../../modules/predefined-errors');

let ListStudents = (function () {

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

  let _findUser = function (req, callback) {
    User.model.findByUser(req.headers['user'],
      function (foundUser) {
        return callback(null, req, foundUser);
      },
      function (userFindError) {
        return callback(userFindError);
      }
    );
  };

  let _validateApiKey = function (req, foundUser, callback) {
    RequestValidator.validateApiKey(foundUser, req.headers['apikey'], function (apiKeyExpired) {
      if (apiKeyExpired) {
        return callback(apiKeyExpired);
      } else {
        return callback(null, req, foundUser);
      }
    });
  };

  let _validateAccessRights = function (req, user, callback) {
    RequestValidator.validateAccessRights(
      user, RouteNames.STUDENTS, HttpVerbs.GET,
      function (error) {
        if (error) {
          /* In case user does not have permissions to access this resource */
          return callback(error);
        } else {
          return callback(null, req);
        }
      });
  };

  let _listStudents = function (req, callback) {
    Student.model.find({}, function (err, students) {
      if (err) {
        return callback(err);
      } else {
        return callback(null, students);
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
            return callback(null, req);
          }
        });
      },

      _findUser,

      _validateApiKey,

      /* User credentials are valid at this point - authentication succeeded */
      /* Now verify user access rights - authorization step */

      _validateAccessRights,

      _listStudents,

      function (students, callback) {
        res.status(200);
        res.send(students);
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
    findUser: _findUser,
    validateApiKey: _validateApiKey,
    validateAccessRights: _validateAccessRights,
    listStudents: _listStudents
  }
})();

module.exports = ListStudents;