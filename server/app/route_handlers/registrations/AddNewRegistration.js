'use strict';

let PredefinedErrors = require('../../modules/predefined-errors');

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

let User = require('../../entities/user');
let Role = require('../../entities/role');
let Registration = require('../../entities/registration');
let Utility = require('../../modules/utility');

const Roles = require('../../constants/roles');
const RouteNames = require('../../constants/routes');
const HttpVerbs = require('../../constants/http-verbs');

/**
 * Use invoke() method of this closure to add (POST) a new registration.
 *
 */
const AddNewRegistration = (function() {

  let _validateRequest = (req, errCallback) => {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.facultyIdentity == undefined
        || req.body.facultyStatus == undefined) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Required parameters not supplied. Please add " +
          "'facultyStatus', 'roles' and 'facultyIdentity' to your request.")
        );
      }

      try {
        let facultyStatusesArray = JSON.parse(req.body.facultyStatus);
        if (facultyStatusesArray.constructor !== Array) {
          return errCallback(PredefinedErrors.getInvalidBodyError(
            "facultyStatus must be an array of double quoted strings."));
        }

        for (let facultyStatusIndex in facultyStatusesArray) {
          if (typeof facultyStatusesArray[facultyStatusIndex] !== "string") {
            return errCallback(PredefinedErrors.getInvalidBodyError(
              "facultyStatus must be an array of double quoted strings."));
          }
        }

      } catch(err) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Faculty statuses must be an array of double quoted strings."));
      }

      try {
        let rolesArray = JSON.parse(req.body.roles);
        if (rolesArray.constructor !== Array) {
          return errCallback(PredefinedErrors.getInvalidBodyError(
            "Roles must be an array of double quoted strings."));
        }

         _validateSuppliedRoles(rolesArray, function(err) {
          if (err) {
            return errCallback(err);
          }
          return errCallback(null);
        });
      } catch (err) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Roles must be an array of double quoted strings."));
      }

    });
  };

  /**
   * If roles is undefined, returns true.
   * If roles are defined, then this function asserts that each supplied
   * role title from the supplied roles array is defined.
   */
  let _validateSuppliedRoles = (roles, returnCallback) => {
    if (roles.length < 1) {
      return returnCallback(PredefinedErrors.getInvalidBodyError("At least one role must be supplied."));
    }

    async.each(roles, function(roleTitle, callback) {
      Role.model.findByTitle(
        roleTitle,
        function() {
          return callback();
        },
        function(errorFindingRole) {
          /* Try to find the role among predefined roles */
          for (let predefinedRole in Roles) {
            if (Roles.hasOwnProperty(predefinedRole)) {
              if (roleTitle == Roles[predefinedRole].title) {
                return callback();
              }
            }
          }
          return callback(errorFindingRole);
        }
      )
    }, function(err) {
      if (err) {
        returnCallback(PredefinedErrors.getInvalidBodyError(err));
      } else {
        returnCallback(null);
      }
    });
  };

  /**
   * Computes and returns (through the supplied callback) the actions that
   * correspond to the given role titles. If some role title will not be found
   * in the database, then predefined roles will be considered instead.
   *
   * @param roleTitles The titles of the roles for which to retrieve the actions
   * @param finishCallback
   * @private
   */
  let _getRoleActionsByTitles = (roleTitles, finishCallback) => {
    async.reduce(roleTitles, [], function(roleActions, roleTitle, callback) {
      Role.model.findByTitle(
        roleTitle,
        function(foundRole) {
          foundRole.actions.forEach(action => roleActions.push(action));
          return callback(null, roleActions);
        },
        function(errFindingRole) {
          /* Try to find the role among predefined roles */
          for (let predefinedRole in Roles) {
            if (Roles.hasOwnProperty(predefinedRole)) {
              if (roleTitle == Roles[predefinedRole].title) {
                Roles[predefinedRole].actions.forEach(action => roleActions.push(action));
                return callback(null, roleActions);
              }
            }
          }
          return callback(errFindingRole);
        }
      )
    }, function (err, rolesWithData) {
      if (err) {
        return finishCallback(err);
      }
      return finishCallback(null, rolesWithData);
    });
  };

  /**
   * Returns, depending on the type of the action that was supplied
   * (i.e. database action or predefined action), the underlying action.
   * 
   * @param action
   * @returns {*|resource|{type, validate}}
   */
  let getActionToAssign = function (action) {
    if (action._doc == undefined) {
      return action;
    }
    return action._doc;
  };

  /**
   * Checks if actionsToAssign belong to userActions set (do not escalate).
   * @param userActions
   * @param actionsToAssign
   * @param finishCb
   * @private
   */
  let _verifyIfActionsToAssignDoNotEscalateUserActions = function(userActions, actionsToAssign, finishCb) {
    async.every(userActions, function(userAction, callback) {
      userAction =  getActionToAssign(userAction);

      for (let actionToAssignIndex in actionsToAssign) {
        let actionToAssign = getActionToAssign(actionsToAssign[actionToAssignIndex]);

        if (Utility.actionsEqual(userAction, actionToAssign)
          || userAction.resource === RouteNames.ANY) {
          return callback(null, true);
        }
      }
      return callback(null, false);

    }, function(err, result) {
      if (result) {
        return finishCb(null);
      }
      return finishCb(PredefinedErrors.getAddNewRegistrationError(
        "You are not allowed to add the requested roles to the new registration."));
    });
  };

  /**
   * Calls finishCallback with or without error depending on whether the current user's roles
   * ant the new user's roles are on the same resource levels (i.e. an user cannot assign roles
   * to a new registration that it does not already possess).
   *
   * @param userRegistration The registration of the user who is making the request
   * @param titlesOfRolesToAssign The titles of the roles that the current user tries to assign
   * to the new registration
   * @param finishCallback The callback that will be called with err or null, depending on the
   * function's behaviour
   * @private
   */
  let _userIsAllowedToAssignRequestedRoles = (userRegistration, titlesOfRolesToAssign, finishCallback) => {
    _getRoleActionsByTitles(userRegistration.roles, function(err, userActions) {
      if (err) {
        return finishCallback(err);
      }

      _getRoleActionsByTitles(titlesOfRolesToAssign, function(err, actionsToAssign) {
        if (err) {
          return finishCallback(err);
        }

        _verifyIfActionsToAssignDoNotEscalateUserActions(userActions, actionsToAssign, function(err) {
          if (err) {
            return finishCallback(err);
          }
          return finishCallback(null);
        });

      })
    })

  };

  const _invoke = (req, res) => {
    
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
      
      /* Validate user's access rights - authorize the user */

      function (user, callback) {
        RequestValidator.validateAccessRights(
          user, RouteNames.REGISTRATIONS, HttpVerbs.POST,
          function (error) {
            if (error) {
              /* In case user does not have permissions to access this resource */
              return callback(error);
            } else {
              return callback(null, user);
            }
          });
        
      },

      function(user, callback) {
        Registration.model.findByFacultyIdentity(
          user.facultyIdentity,
          function(registration) {
            return callback(null, user, registration);
          },
          function(registrationFindError) {
            return callback(registrationFindError);
          });
      },
      
      /* After retrieving user registration, make sure that the user is assigning */
      /* Permissions that he is allowed to assign */
      
      function(user, registration, callback) {
        if (req.body.roles == undefined)
          return callback(null, user);
        
        _userIsAllowedToAssignRequestedRoles(registration, JSON.parse(req.body.roles), function (err) {
          if (err) {
            return callback(err);
          }
          return callback(null, user);
        });
      },

      /* We made sure that user assigned the new registration roles to resource it had access to. */
      /* At this point, the user is authorized to create a new registration. */

      function(user, callback) {
        const registration = new Registration.model({
          facultyIdentity: req.body.facultyIdentity,
          facultyStatus: req.body.facultyStatus,
          roles: req.body.roles
        });

        registration.save(function (err) {
          if (err) {
            return callback(err);
          } else {
            return callback(null);
          }
        });
      }
      
    ], function(err, results) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(200);
        results != undefined ? res.send(results) : res.end();
      }
    });

  };

  return ({
    invoke: _invoke
  })
})();

module.exports = AddNewRegistration;