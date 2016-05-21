'use strict';

let async = require('async');

let Errors = require('../constants/errors');
let Error = require('../modules/error');
let PredefinedErrors = require('../modules/predefined-errors');

const RouteNames = require('../constants/routes');

const Role = require('../entities/role');
const Registration = require('../entities/registration');
const PredefinedRoles = require('../constants/roles');

let util = require('util');

let RequestValidator = (function () {

  let _isAllowedAccessBasedOnRoleActions = function (roleActions, resource, verb) {
    for (let actionIndex in roleActions) {
      if (!roleActions[actionIndex].hasOwnProperty('resource') || !roleActions[actionIndex].hasOwnProperty('verb')) {
        return false;
      }

      if ((resource === roleActions[actionIndex].resource || RouteNames.ANY === roleActions[actionIndex].resource)
        && verb === roleActions[actionIndex].verb) {

      }
    }
    return false;
  };

  let _registrationHasPredefinedRole = function (registration, predefinedRole) {
    return registration.roles.indexOf(predefinedRole.title != -1);
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

      function(callback) {
        Registration.model.findByFacultyIdentity(
          user.facultyIdentity,
          function (foundRegistration) {
            return callback(null, foundRegistration);
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
          if (_registrationHasPredefinedRole(registration, PredefinedRoles[predefinedRole]
              && _roleIsAuthorizedOnResource(PredefinedRoles[predefinedRole], resource, verb))) {
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
   * Validates that the supplied request is authenticated -
   * The request is authenticated if, for the supplied user,
   * the correct apiKey is provided.
   */
  let _requestContainsAuthenticationData = function (req) {
    /* Assumes the request body is a valid encoding body */
    return req.body.user != undefined && req.body.apiKey != undefined;

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

  return ({
    validateApiKey: _validateApiKey,
    validateAccessRights: _validateAccessRights,
    bodyIsValid: _bodyIsValid,
    requestContainsAuthenticationData: _requestContainsAuthenticationData
  });
})();

module.exports = RequestValidator;
