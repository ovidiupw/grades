/**
 * Created by dryflo on 5/18/2016.
 */
'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');
let util = require('util');

let PredefinedErrors = require('../../modules/predefined-errors');
let Errors = require('../../constants/errors');
let Error = require('../../modules/error');

let User = require('../../entities/user');
let Professor = require('../../entities/professor');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

/**
 * Use invoke() method of this closure to register (POST) a new
 * identity for the calling user (identified in the request body).
 *
 * @type {{invoke}}
 */
let AddNewProfessor = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.user == undefined ||
        req.body.facultyIdentity == undefined ||
        req.body.gradDidactic == undefined ||
        req.body.courses == undefined) {
        return errCallback(new Error(
          Errors.REQ_BODY_INVALID.id,
          Errors.REQ_BODY_INVALID.message,
          "Required parameters not supplied. Please add " +
          "'user', 'facultyIdentity', 'gradDidactic', 'courses' to your request."
        ));
      }
      let coursesArray;
      try {
        coursesArray = JSON.parse(req.body.courses);
      } catch (ignored) {
      }

      if (!util.isArray(coursesArray)) {
        return errCallback(new Error(
          Errors.REQ_BODY_INVALID.id,
          Errors.REQ_BODY_INVALID.message,
          "Invalid parameter type for 'courses'. Expected an array."
        ));
      }
      for (let course in coursesArray) {
        if (!util.isObject(course) || course.courseId == undefined || !util.isArray(course.academicGroups)) {

          return errCallback(new Error(
            Errors.REQ_BODY_INVALID.id,
            Errors.REQ_BODY_INVALID.message,
            "One of the supplied actions had an invalid format. " +
            "Each course must be an object with fields {courseId, academicGroup:array}."
          ));
        }
      }
      return errCallback(null);
    });
  };

  let _invoke = function (req, res) {
    async.waterfall([

      function (callback) {
        _validateRequest(req, function (invalidRequest) {
          if (invalidRequest) {
            return callback(invalidRequest);
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
          function (userFindError) {
            return callback(userFindError);
          }
        );
      },

      /* In case of success, the user has been found. */
      function (foundUser, callback) {
        RequestValidator.validateApiKey(foundUser, req.body.apiKey, function (apiKeyExpired) {
          if (apiKeyExpired) {
            return callback(apiKeyExpired);
          } else {
            return callback(null, foundUser);
          }
        });
      },

      function (user, callback) {
        RequestValidator.validateAccessRights(
          user, RouteNames.PROFESSORS, HttpVerbs.POST,
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
        Professor.model.findByUser(req.body.user,
          function (userExists) {
            return callback(null, userExists);
          },
          function (userExistsError) {
            return callback(new Error(
              Errors.USER_ALREADY_EXISTS.id,
              Errors.USER_ALREADY_EXISTS.message,
              "The user already exists"
            ));
          }
        );
      },

      function (callback) {
        let newProfessor = new Professor.model({
          user: req.body.user,
          facultyIdentity: req.body.facultyIdentity,
          gradDidactic: req.body.gradDidactic,
          courses: req.body.courses
        });

        newProfessor.save(
          function (userSaved) {
            return callback(null, userSaved);
          },
          function (userSavedErr) {
            return callback(userSavedErr);
          });

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
  };

  return {
    invoke: _invoke
  }
})();

module.exports = AddNewProfessor;