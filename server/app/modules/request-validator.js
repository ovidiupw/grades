'use strict';

let async = require('async');

let Errors = require('../constants/errors');
let SchemaConstraints = require('../constants/schema-constraints');
let Error = require('../modules/error');
let PredefinedErrors = require('../modules/predefined-errors');

const RouteNames = require('../constants/routes');

const Role = require('../entities/role');
const Course = require('../entities/course');
const Registration = require('../entities/registration');
const PredefinedRoles = require('../constants/roles');

let util = require('util');

const jsep = require("jsep");

let RequestValidator = (function () {

  let _requestDoesNotContainOwnFacultyIdentity = function (facultyIdentity, req, errCallback) {
    process.nextTick(() => {
      if (facultyIdentity === req.body.facultyIdentity) {
        return errCallback(new Error(
          Errors.OWN_FACULTY_IDENTITY.id,
          Errors.OWN_FACULTY_IDENTITY.message,
          Errors.OWN_FACULTY_IDENTITY.data
        ));
      } else {
        return errCallback(null);
      }
    });
  };

  let _isAllowedAccessBasedOnRoleActions = function (roleActions, resource, verb) {
    for (let actionIndex in roleActions) {
      if (!roleActions[actionIndex]._doc.hasOwnProperty('resource') || !roleActions[actionIndex]._doc.hasOwnProperty('verb')) {
        return false;
      }

      if ((resource === roleActions[actionIndex]._doc.resource || RouteNames.ANY === roleActions[actionIndex]._doc.resource)
        && verb === roleActions[actionIndex]._doc.verb) {
        return true;
      }
    }
    return false;
  };

  let _registrationHasPredefinedRole = function (registration, predefinedRole) {
    return registration.roles.indexOf(predefinedRole.title) != -1;
  };

  let _roleIsAuthorizedOnResource = function (predefinedRole, resource, verb) {
    let actions = predefinedRole.actions;

    for (let actionIndex in actions) {
      if ((resource === actions[actionIndex].resource || RouteNames.ANY === actions[actionIndex].resource)
        && verb === actions[actionIndex].verb) {
        return true;
      }
    }
    return false;
  };

  let _SUCCESS_BREAK = "Success!";

  /**
   * Validates that the user has access rights on the resource-verb
   * combination. Invokes the callback if an error occurs or the
   * user doesn't have access rights.
   */
  let _validateAccessRights = function (user, resource, verb, errCallback) {

    async.waterfall([

      function(callback) {
        if (user.identityConfirmed == false) {
          return callback(new Error(
            Errors.IDENTITY_NOT_CONFIRMED.id,
            Errors.IDENTITY_NOT_CONFIRMED.message
          ));
        }
        return callback(null);
      },

      function (callback) {
        Registration.model.findByFacultyIdentity(
          user.facultyIdentity,
          function (foundRegistration) {
            return callback(null, foundRegistration._doc);
          },
          function (registrationNotFoundError) {
            return callback(registrationNotFoundError);
          }
        );
      },

      function(registration, callback) {
        if (registration == undefined || registration.roles == undefined) {
          return callback(PredefinedErrors.getNotAuthorizedError("The user has no associated registration or roles."));
        }
        return callback(null, registration);
      },

      /* Verify if user is authorized based on PredefinedRoles */

      function(registration, callback) {
        
        for (let predefinedRole in PredefinedRoles) {
          if (_registrationHasPredefinedRole(registration, PredefinedRoles[predefinedRole])
              && _roleIsAuthorizedOnResource(PredefinedRoles[predefinedRole], resource, verb)) {
            return callback(_SUCCESS_BREAK);
          }
        }
        return callback(null, registration);
      },

      /* Verify if user is authorized based on roles associated with its registration */

      function(registration, callback) {
        let roles = registration.roles;
        
        for (let roleTitleIndex in roles) {

          if (!registration.hasOwnProperty('roles')) {
            return callback(PredefinedErrors.getNotAuthorizedError("The user registration roles are invalid."));
          }

          Role.model.findByTitle(
            roles[roleTitleIndex],
            function (foundRole) {
              if (!_isAllowedAccessBasedOnRoleActions(foundRole.actions, resource, verb)) {
                return callback(PredefinedErrors.getNotAuthorizedError("The user is not allowed to access this resource"));
              }
              return callback(null);
            },
            function (err) {
              return callback(err);
            }
          );
        }
      }

    ], function(err, results) {
      if (err === _SUCCESS_BREAK || err == null) {
        return errCallback(null);
      }
      return errCallback(err);
    });
  };

  /**
   * Validates that the supplied body is valid. Invokes the callback if not.
   */
  let _bodyIsValid = function (body) {
    if (!body) {
      return false;
    }
    return true;
  };

  /**
   * Validates that the supplied header is valid. Invokes the callback if not.
   */
  let _headerIsValid = function (headers) {
    if (!headers) {
      return false;
    }
    return true;
  };

  /**
   * Validates that the supplied request is authenticated -
   * The request is authenticated if, for the supplied user,
   * the correct apiKey is provided.
   */
  let _requestContainsAuthenticationData = function (req) {
    /* Assumes the request body is a valid encoding body */
    return req.body.user != undefined && req.body.apiKey != undefined;

  };

  let _requestHeaderContainsAuthenticationData = function (req) {
    /* Assumes the request header is a valid encoding header */
    return req.headers['user'] != undefined && req.headers['apikey'] != undefined;

  };

  /**
   * Validates that the supplied request contains a valid faculty identity.
   */
  let _requestContainsValidFacultyIdentity = function (req) {
    //var facultyIdentityRegularExpression = new RegExp("[a-z]+\\.[a-z]+@" + Domains.FII + "$");
    return req.body.facultyIdentity.length > SchemaConstraints.facultyIdentityMinLength &&
      req.body.facultyIdentity.length < SchemaConstraints.facultyIdentityMaxLength ;
      //&& facultyIdentityRegularExpression.test(req.body.facultyIdentity);
  };

  /**
   * Validates that the supplied request contains a valid birth date.
   */
  let _requestContainsValidBirthDate = function (req) {
    return req.body.birthDate instanceof Date;
  };

  /**
   * Validates that a certain course is in a list of courses.
   */
  let _requestContainsValidCreatedByIdentity = function (req, courses, errCallback) {
    process.nextTick(() => {
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseId === req.body.courseId) {
          return errCallback(null);
        }
      }
      return errCallback(new Error(
        Errors.PROFESSOR_MODULE_COURSE_MISMATCH.id,
        Errors.PROFESSOR_MODULE_COURSE_MISMATCH.message,
        Errors.PROFESSOR_MODULE_COURSE_MISMATCH.data
      ));
    });
  };

  /**
   * Array of modules (identifiers) from the tree.
   */
  let identifiers = [];

  /**
   * Gets the modules (identifiers) from the tree.
   */
  let _getIdentifiers = function (items, level) {
    for (var key in items) {
      if (items.hasOwnProperty(key)) {

        if (key === 'name') {
          identifiers.push(items[key]);
        }

        if (items[key] != null && typeof items[key] === "object") {
          _getIdentifiers(items[key], level + 1);
        }
      }
    }
  };

  /**
   * Checks if the formula from the request is valid.
   */
  let _requestContainsValidFormula = function (req, modules, errCallback) {
    process.nextTick(() => {
        let parse_tree = jsep(req.body.formula);

        _getIdentifiers(parse_tree, 0);

        if (identifiers.length > 0) {
          for (let i = 0; i < identifiers.length; i++) {
            let found = false;
            for (let j = 0; i < modules.length; j++) {
              if (modules[j].moduleId == identifiers[i]) {
                found = true;
                break;
              }
            }
            if (found == false) {
              return errCallback(new Error(
                Errors.INVALID_FORMULA.id,
                Errors.INVALID_FORMULA.message,
                Errors.INVALID_FORMULA.data
              ));
            }
          }
        }
        return errCallback(null);
      }
    );
  };

  let _validateApiKey = function (user, requestKey, errCallback) {
    process.nextTick(() => {
      if (user.apiKey !== requestKey) {
        return errCallback(new Error(
          Errors.API_KEY_INVALID.id,
          Errors.API_KEY_INVALID.message,
          Errors.API_KEY_INVALID.data
        ));
      }

      var expirationDate = new Date(user.keyExpires);
      var currentDate = new Date();

      if (currentDate >= expirationDate) {
        return errCallback(new Error(
          Errors.API_KEY_EXPIRED.id,
          Errors.API_KEY_EXPIRED.message,
          Errors.API_KEY_EXPIRED.data
        ));
      }
      return errCallback(null);
    });
  };

  let _searchForCourse = function (currentCourse,coursesArray,req,errCallback) {
    if (currentCourse < coursesArray.length) {
      Course.model.findByCourseId(coursesArray[currentCourse].courseId,
        function (foundCourse) {
          if (currentCourse == coursesArray.length - 1) {
            return errCallback(null, req);
          }
          _searchForCourse(currentCourse + 1);
        },
        function (err) {
          return errCallback(err);
        });
    }
  };


  let _checkForDuplicatesDuplicates = function checkForDuplicatesDuplicates(currentCourse,coursesArray,req,errCallback) {
    if((new Set(coursesArray[currentCourse].academicGroups)).size !== coursesArray[currentCourse].academicGroups.length){
      return errCallback(new Error(
        Errors.DUPLICATE_ACADEMIC_GROUP_FOUND.id,
        Errors.DUPLICATE_ACADEMIC_GROUP_FOUND.message,
        "A duplicate academic group was found "+coursesArray[currentCourse].academicGroups
      ));
    }else{
      if(currentCourse == coursesArray.length -1){
        return errCallback(null,req);
      }else{
        _checkForDuplicatesDuplicates(currentCourse +1);
      }
    }
  };


  return ({
    validateApiKey: _validateApiKey,
    validateAccessRights: _validateAccessRights,
    bodyIsValid: _bodyIsValid,
    headerIsValid: _headerIsValid,
    requestContainsAuthenticationData: _requestContainsAuthenticationData,
    requestContainsValidFacultyIdentity: _requestContainsValidFacultyIdentity,
    requestContainsValidBirthDate: _requestContainsValidBirthDate,
    requestContainsValidCreatedByIdentity: _requestContainsValidCreatedByIdentity,
    requestContainsValidFormula: _requestContainsValidFormula,
    requestHeaderContainsAuthenticationData: _requestHeaderContainsAuthenticationData,
    requestDoesNotContainOwnFacultyIdentity: _requestDoesNotContainOwnFacultyIdentity,
    searchForCourse: _searchForCourse,
    checkForDuplicatesDuplicates: _checkForDuplicatesDuplicates
  });
})();

module.exports = RequestValidator;
