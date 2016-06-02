'use strict';

let PredefinedErrors = require('../../modules/predefined-errors');

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

let User = require('../../entities/user');
let Registration = require('../../entities/registration');

/**
 * Use invoke() method of this closure to confirm (PUT) a previously
 * registered identity for the calling user (identified in the request body).
 */
let ConfirmIdentity = (function() {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.identitySecret == undefined) {
        return errCallback(PredefinedErrors.getInvalidBodyError(
          "Required parameters not supplied. Please add " +
          "'identitySecret' to your request.")
        );
      }
      return errCallback(null);
    });
  };

  let _invoke =  function (req, res) {
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
        User.model.findByFacultyIdentity(req.body.user,
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

      /* Verify that the supplied identitySecret matches the database generated identitySecret */

      function(user, callback) {
        if (user.facultyIdentity == undefined) {
          callback(PredefinedErrors.getIdentityConfirmationError(
            "No faculty identity was associated with this account."));
        }

        Registration.model.findByUser(
          user.facultyIdentity,
          function(foundRegistration) {
            return callback(null, user, foundRegistration);
          },
          function(registrationFindError) {
            return callback(registrationFindError);
          })
      },

      /* Verify if supplied identity secret and the database generated one match */

      function(user, userRegistration, callback) {
        if (userRegistration.identitySecret !== req.body.identitySecret) {
          return callback(PredefinedErrors.getIdentityConfirmationError(
            "The supplied identity secret did not match the generated one."));
        }

        return callback(null, user);
      },

      /* At this point, the identity was confirmed, so update user identity-confirmed field to true */

      function(user, callback) {
        User.model.confirmFacultyIdentity(
          user._id,
          function(err) {
            return callback(err);
          },
          function() {
            return callback(null);
          }
        );
      }

    ], function (err, results) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(200);
        results != undefined ? res.send(results) : res.end();
      }
    });
  };

  return {
    invoke: _invoke
  }
}());

module.exports = ConfirmIdentity;
