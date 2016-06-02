'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Student = require('../../entities/student');
let Registration = require('../../entities/registration');

let PredefinedErrors = require('../../modules/predefined-errors');

let AddNewStudent = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.facultyIdentity == undefined ||
        req.body.registrationNumber == undefined ||
        req.body.birthDate == undefined ||
        req.body.academicYear == undefined ||
        req.body.academicGroup == undefined) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Required parameters not supplied. Please add " +
          "'facultyIdentity', 'registrationNumber', 'birthDate', 'academicYear' and 'academicGroup' to your request."));
      }
      if (!RequestValidator.requestContainsValidFacultyIdentity(req)) {
        return errCallback(PredefinedErrors.getFacultyIdentityError());
      }
      if (!RequestValidator.requestContainsValidBirthDate(req)) {
        return errCallback(PredefinedErrors.getBirthDateError());
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
        User.model.findByFacultyIdentity(req.body.user,
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
          user, RouteNames.STUDENTS, HttpVerbs.POST,
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

        let newStudent = new Student.model({
          facultyIdentity: req.body.facultyIdentity,
          registrationNumber: req.body.registrationNumber,
          birthDate: req.body.birthDate,
          academicYear: req.body.academicYear,
          academicGroup: req.body.academicGroup
        });

        newStudent.save(function (studentSaveError) {
          if (studentSaveError) {
            callback(PredefinedErrors.getDatabaseOperationFailedError(studentSaveError));
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

module.exports = AddNewStudent;