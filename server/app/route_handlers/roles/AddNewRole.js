'use strict';

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

let User = require('../../entities/user');
let Role = require('../../entities/role');
let Roles = require('../../constants/roles');
let Utility = require('../../modules/utility');

let PredefinedErrors = require('../../modules/predefined-errors');

let util = require('util');

/**
 * Use invoke() method of this closure to create (POST) a new role.
 */
let AddNewRole = (function () {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.title == undefined || req.body.actions == undefined) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Required parameters not supplied. Please add " +
          "'title' and 'actions' to your request."));
      }

      let err = _validateRequestActions(req.body.actions);
      if (err != null) {
        return errCallback(err);
      }

      return errCallback(null);
    });
  };

  let _validateRequestActions = function (actionsJSON) {
    let actions;
    try {
      actions = JSON.parse(actionsJSON);
    } catch (ignored) {
      return PredefinedErrors.getInvalidBodyError("Invalid parameter type for 'actions'. Expected an array.");
    }

    if (!util.isArray(actions)) {
      return PredefinedErrors.getInvalidBodyError("Invalid parameter type for 'actions'. Expected an array.");
    }

    if (actions.length < 1) {
      return PredefinedErrors.getInvalidBodyError("Actions array must have at least one element.");
    }

    for (let actionIndex in actions) {
      if (!util.isObject(actions[actionIndex])
        || actions[actionIndex].verb == undefined
        || actions[actionIndex].resource == undefined) {

        return PredefinedErrors.getInvalidBodyError("One of the supplied actions had an invalid format. " +
          "Each action must be an object with fields {verb, resource}.");
      }

      if (!_isActionObjectValid(actions[actionIndex])) {
        return PredefinedErrors.getInvalidBodyError("Invalid action object specified: "
          + JSON.stringify(actions[actionIndex]));
      }
    }

    return null;
  };

  let _isActionObjectValid = function(actionObject) {
    if (Object.keys(actionObject).length !== 2) return false;
    if (!_objectContainsValidHttpVerb(actionObject)) return false;
    if (!_objectContainsValidHttpRoute(actionObject)) return false;

    return true;
  };

  let _objectContainsValidHttpVerb = function(actionObject) {
    for (let httpVerb in HttpVerbs) {
      if (HttpVerbs.hasOwnProperty(httpVerb)) {
        if (actionObject[Utility.PATH.VERB] === httpVerb) return true;
      }
    }
    return false;
  };

  let _objectContainsValidHttpRoute = function(actionObject) {
    for (let routeName in RouteNames) {
      if (RouteNames.hasOwnProperty(routeName)) {
        if (actionObject[Utility.PATH.RESOURCE] === RouteNames[routeName]) return true;
      }
    }
    return false;
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
          user, RouteNames.ROLES, HttpVerbs.POST,
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
        let actions = JSON.parse(req.body.actions); // function catch should have been verified earlier

        let newRole = new Role.model({
          title: req.body.title,
          actions: actions
        });

        newRole.save(function (roleSaveError) {
          if (roleSaveError) {
            callback(PredefinedErrors.getDatabaseOperationFailedError(roleSaveError));
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

module.exports = AddNewRole;
