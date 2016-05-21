'use strict';

let Errors = require('../constants/errors');
let Error = require('../modules/error');

const RouteNames = require('../constants/routes');
const HttpVerbs = require('../constants/http-verbs');


const Role = require('../entities/role');
const Registration = require('../entities/registration');
const PredefinedRoles = require('../constants/roles');

let util = require('util');

let RequestValidator = (function () {

  /**
   * Validates that the user has access rights on the resource-verb
   * combination. Invokes the callback if an error occurs or the
   * user doesn't have access rights.
   */
  let _validateAccessRights = function (user, resource, verb, errCallback) {
    if (user.idenityConfirmed == false) {
      return errCallback(new Error(
        Errors.NOT_AUTHORIZED.id,
        Errors.NOT_AUTHORIZED.message,
        undefined
      ));
    }

    let _registration;
    let _error = false;
    let _errorObject;

    Registration.model.findByFacultyIdentity(
      user.facultyIdentity,
      function (foundRegistration) {
        _registration = foundRegistration;
      },
      function (err) {
        _error = true;
        _errorObject = err;
        }
    );
    if (_error) return errCallback(_errorObject);

    let _authorized = false;
    if (_registration != undefined && _registration.roles != undefined) {
      /* We managed to obtain user faculty registration with its roles */

      for (let roleTitle in _registration.roles) {
        Role.model.findByTitle(roleTitle, function (foundRole) {
            for (let action in foundRole.actions) {
              if ((resource === action.resource || RouteNames.ANY === action.resource) && verb === action.verb) {
                _authorized = true;
                return;
              }
            }
            },
            function (err) {
              if (err.id !== 9) { /* Error on finding role. */
                _error = true;
                _errorObject = err;
              }
              /* If error id is 9, then the role was not found. Still need to
               search predefined roles to see if its in there. */
            }
        );


        if (_authorized) return errCallback(null);
        if (_error) return errCallback(_errorObject);
      }

      for (let predefinedRole in PredefinedRoles) {
        if (_registration.roles.indexOf(PredefinedRoles[predefinedRole].title != -1)) {

          for (let action in PredefinedRoles[predefinedRole].actions) {
            if ((resource === action.resource || RouteNames.ANY === action.resource) && verb === action.verb) {
              _authorized = true;
              break;
            }
          }

          if (_authorized) break;
        }
      }
    }

    if (!_authorized) {
      return errCallback(new Error(
        Errors.NOT_AUTHORIZED.id,
        Errors.NOT_AUTHORIZED.message,
        undefined
      ));
    }

    /* Finally, don't throw error via errCallback if user is authorized */
    return errCallback(null);
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
    if (req.body.user == undefined || req.body.apiKey == undefined) {
      return false;
    }
    return true;
  };

  /**
   * Validates if the supplied request is valid (i.e.
   * has the required body fields and has valid parameters).
   */
  let _validateRegistrationsPostRequest = function (req, errCallback) {
    if (!_bodyIsValid(req.body)) {
      return errCallback(new Error(
        Errors.REQ_BODY_INVALID.id,
        Errors.REQ_BODY_INVALID.message,
        "Unexpected body encoding supplied."
      ));
    }
    if (!_requestContainsAuthenticationData(req)) {
      return errCallback(new Error(
        Errors.AUTHORIZATION_DATA_NOT_FOUND.id,
        Errors.AUTHORIZATION_DATA_NOT_FOUND.message,
        undefined
      ));
    }

    if (req.body.facultyIdentity == undefined || req.body.roles == undefined) {
      return errCallback(new Error(
        Errors.REQ_BODY_INVALID.id,
        Errors.REQ_BODY_INVALID.message,
        "Required parameters not supplied. Please add " +
        "'roles' and 'facultyIdentity' to your request."
      ));
    }

    let rolesArray;
    try {
      rolesArray = JSON.parse(req.body.roles);
    } catch (ignored) {
    }

    if (!util.isArray(rolesArray)) {
      return errCallback(new Error(
        Errors.REQ_BODY_INVALID.id,
        Errors.REQ_BODY_INVALID.message,
        "Invalid parameter type for 'roles'. Expected an array."
      ));
    }

    /** Tries to find the supplied roles in the database. If it cannot find
     them in the database, it searches for any predefined roles in the app.
     */
    for (let role in rolesArray) {

      let _error = false;
      let _errorObject;
      let _checkForPredefinedRoles = true;

      Role.model.findByTitle(
        role,
        function (foundRole) {
          _checkForPredefinedRoles = false;
        },
        function (err) {
          /* Shouldn't throw error just because role was not found in db. */
          /* We need to search through predefined roles also. */
          if (err.id !== 9) {
            _error = true;
            _errorObject = err;
          }
        }
      );
      if (_error) return errCallback(_errorObject);

      if (!_checkForPredefinedRoles) continue;
      for (let predefinedRole in PredefinedRoles) {
        if (PredefinedRoles[predefinedRole].title === role) {
          break;
          /* All good. Found the role as a predefined one. */
          /* Now resume the outer loop which loops through supplied roles. */
        }
      }

      /* If reached this line, no role was found, either in db or predefined. */
      return errCallback(new Error(
        Errors.INVALID_ROLE.id,
        Errors.INVALID_ROLE.message,
        Errors.INVALID_ROLE.data
      ));

    } // end for(role in rolesArray)

    return errCallback(null);
  };

  /**
   * Validates if the supplied request is valid (i.e.
   * has the required body fields and has valid parameters).
   */
  let _validateRolesPostRequest = function (req, errCallback) {
    if (!_bodyIsValid(req.body)) {
      return errCallback(new Error(
        Errors.REQ_BODY_INVALID.id,
        Errors.REQ_BODY_INVALID.message,
        "Unexpected body encoding supplied."
      ));
    }
    if (!_requestContainsAuthenticationData(req)) {
      return errCallback(new Error(
        Errors.AUTHORIZATION_DATA_NOT_FOUND.id,
        Errors.AUTHORIZATION_DATA_NOT_FOUND.message,
        undefined
      ));
    }

    if (req.body.title == undefined || req.body.actions == undefined) {
      return errCallback(new Error(
        Errors.REQ_BODY_INVALID.id,
        Errors.REQ_BODY_INVALID.message,
        "Required parameters not supplied. Please add " +
        "'title' and 'actions' to your request."
      ));
    }

    let actionsArray;
    try {
      actionsArray = JSON.parse(req.body.actions);
    } catch (ignored) {
    }

    if (!util.isArray(actionsArray)) {
      return errCallback(new Error(
        Errors.REQ_BODY_INVALID.id,
        Errors.REQ_BODY_INVALID.message,
        "Invalid parameter type for 'actions'. Expected an array."
      ));
    }

    for (let action in actionsArray) {
      if (!util.isObject(action) || action.verb == undefined || action.resource == undefined) {

        return errCallback(new Error(
          Errors.REQ_BODY_INVALID.id,
          Errors.REQ_BODY_INVALID.message,
          "One of the supplied actions had an invalid format. " +
          "Each action must be an object with fields {verb, resurce}."
        ));
      }
    }

    return errCallback(null);
  };


  /**
   * Validates the supplied req - path - verb combination. Calls errCallback
   * if the combination is not valid. This method is just a selector.
   * Subsequent validation methods will be called for each particular combination.
   *
   */
  let _validateRequest = function (req, path, verb, errCallback) {
    switch (path + verb) {
      case RouteNames.ROLES + HttpVerbs.POST:
        _validateRolesPostRequest(req, errCallback);
        break;
      case RouteNames.REGISTRATIONS + HttpVerbs.POST:
        _validateRegistrationsPostRequest(req, errCallback);
        break;
    }
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
    validateRequest: _validateRequest,
    validateApiKey: _validateApiKey,
    validateAccessRights: _validateAccessRights,
    bodyIsValid: _bodyIsValid,
    requestContainsAuthenticationData: _requestContainsAuthenticationData
  });
})();

module.exports = RequestValidator;
