'use strict'

let PredefinedErrors = require('../../modules/predefined-errors');

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

let User = require('../../entities/user');
let Role = require('../../entities/role');
let Registration = require('../../entities/registration');


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
          "'facultyStatus' and 'facultyIdentity' to your request.")
        );
      }

      let rolesValidationResult = _validateSuppliedRoles(req.body.roles);
      if (rolesValidationResult != null) {
        return errCallback(PredefinedErrors.getInvalidBodyError())
      }

      return errCallback(null);
    });
  };

  /**
   * If roles is undefined, returns true.
   * If roles are defined, then this function asserts that each supplied
   * role title from the supplied roles array is defined.
   */
  let _validateSuppliedRoles = (roles) => {
    if (roles == undefined) return null;

    async.each(roles, function(roleTitle, callback) {
      Role.model.findByTitle(
        roleTitle,
        function() {
          callback();
        },
        function(errorFindingRole) {
          callback(errorFindingRole);
        }
      )
    });
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
      
      /* At this point, the user is authorized to create a new registration */
      
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