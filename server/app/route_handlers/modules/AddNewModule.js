'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Professor = require('../../entities/professor');
let Module = require('../../entities/module');
let Course = require('../../entities/course');

let PredefinedErrors = require('../../modules/predefined-errors');

let AddNewModule = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.moduleId == undefined ||
        req.body.title == undefined ||
        req.body.courseId == undefined ||
        req.body.createdBy == undefined ||
        req.body.minToPromote == undefined ||
        req.body.formula == undefined ||
        req.body.min == undefined ||
        req.body.max == undefined) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Required parameters not supplied. Please add " +
          "'moduleId', 'title', 'courseId', 'createdBy', 'minToPromote', 'formula', 'min' and 'max' to your request."));
      }

      return errCallback(null);
    });
  };

  let _findProfessorById = function (req, callback) {
    Professor.model.findByFacultyIdentity(req.body.createdBy,
      function (foundProfessor) {
        return callback(null, req, foundProfessor);
      },
      function (error) {
        return callback(PredefinedErrors.getProfessorFacultyIdentityError(error));
      }
    );
  };

  let _isProfessorAbleToAddModule = function (req, foundProfessor, callback) {
    RequestValidator.requestContainsValidCreatedByIdentity(req, foundProfessor.courses, function (courseError) {
      if (courseError) {
        return callback(courseError);
      } else {
        return callback(null, req);
      }
    });
  };

  let _isCourseValid = function (req, callback) {
    Course.model.findByCourseId(req.body.courseId,
      function (foundCourse) {
        return callback(null, req, foundCourse);
      },
      function (error) {
        return callback(PredefinedErrors.getCourseIdError(error));
      }
    );
  };

  let _isFormulaValid = function (req, foundCourse, callback) {
    RequestValidator.requestContainsValidFormula(req, foundCourse.modules, function (invalidFormula) {
      if (invalidFormula) {
        return callback(invalidFormula);
      } else {
        return callback(null, req);
      }
    });
  };

  let _findUser = function (req, callback) {
    User.model.findByUser(req.body.user,
      function (foundUser) {
        return callback(null, req, foundUser);
      },
      function (error) {
        return callback(PredefinedErrors.getDatabaseOperationFailedError(error));
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
      user, RouteNames.MODULES, HttpVerbs.POST,
      function (error) {
        if (error) {
          /* In case user does not have permissions to access this resource */
          return callback(error);
        } else {
          return callback(null, req);
        }
      });
  };

  let _addModule = function (req, callback) {
    let newModule = new Module.model({
      moduleId: req.body.moduleId,
      title: req.body.title,
      createdBy: req.body.createdBy,
      minToPromote: req.body.minToPromote,
      formula: req.body.formula,
      min: req.body.min,
      max: req.body.max,
      courseId: req.body.courseId
    });

    newModule.save(function (moduleSaveError) {
      if (moduleSaveError) {
        callback(PredefinedErrors.getDatabaseOperationFailedError(moduleSaveError));
      } else {
        callback(null, req);
      }
    });
  };

  let _updateModuleInCourses = function (req, callback) {
    let module = {moduleId: req.body.moduleId};
    Course.model.update({"courseId": req.body.courseId}, {"$push": {"modules": module}}, function (courseUpdateErr) {
      if (courseUpdateErr) {
        return callback(PredefinedErrors.getDatabaseOperationFailedError(courseUpdateErr));
      } else {
        return callback(null);
      }
    });
  };

  let _invoke = function (req, res) {
    async.waterfall([

      /* Validating the request. */

      function (callback) {
        _validateRequest(req, function (invalidRequestError) {
          if (invalidRequestError) {
            return callback(invalidRequestError);
          } else {
            return callback(null, req);
          }
        });
      },

      /* We check if there exists a professor with the facultyIdentity
       equal to the value of the createdBy field from the request. */

      _findProfessorById,

      /* Now we have to check if the professor can create this module. */

      _isProfessorAbleToAddModule,

      /* We also have to check if the course exists. */

      _isCourseValid,

      /* We check if the formula is valid. */

      _isFormulaValid,

      _findUser,

      _validateApiKey,

      /* User credentials are valid at this point - authentication succeeded */
      /* Now verify user access rights - authorization step */

      _validateAccessRights,

      /* User has permission to add the module at this point - authorized */

      _addModule,

      /* Now update the module id from modules array in courses collection */

      _updateModuleInCourses,

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
    findProfessorById: _findProfessorById,
    isProfessorAbleToAddModule: _isProfessorAbleToAddModule,
    isCourseValid: _isCourseValid,
    isFormulaValid: _isFormulaValid,
    findUser: _findUser,
    validateApiKey: _validateApiKey,
    validateAccessRights: _validateAccessRights,
    addModule: _addModule,
    updateModuleInCourses: _updateModuleInCourses
  }
})();

module.exports = AddNewModule;