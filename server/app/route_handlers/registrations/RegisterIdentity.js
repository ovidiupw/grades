'use strict';

let Errors = require('../../constants/errors');
let Error = require('../../modules/error');
let PredefinedErrors = require('../../modules/predefined-errors');

let async = require('async');
let RequestValidator = require('../../modules/request-validator');

let User = require('../../entities/user');
let Registration = require('../../entities/registration');
const Mailer = require('../../modules/mailer');
const EmailMessages = require('../../constants/email-messages');

/**
 * Use invoke() method of this closure to register (POST) a new
 * identity for the calling user (identified in the request body).
 */
let RegisterIdentity = (function() {

  let _validateRequest = function (req, errCallback) {

    process.nextTick(() => {
      if (!RequestValidator.bodyIsValid(req.body)) {
        return errCallback(PredefinedErrors.getInvalidBodyError());
      }
      if (!RequestValidator.requestContainsAuthenticationData(req)) {
        return errCallback(PredefinedErrors.getAuthorizationDataNotFoundError());
      }
      if (req.body.facultyIdentity == undefined) {
        return errCallback(new Error(
          Errors.REQ_BODY_INVALID.id,
          Errors.REQ_BODY_INVALID.message,
          "Required parameters not supplied. Please add " +
          "'facultyIdentity' to your request."
        ));
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

      /* Verify if the supplied identity exists in the database. */
      /* This is necessary because a user must have an identity in the
       database, with its associated roles, before it can use that identity.
       The identity MUST be created prior to user registration (association)
       with that identity. */
      function (foundUser, callback) {
        Registration.model.findByFacultyIdentity(
          req.body.facultyIdentity,
          function (foundRegistration) {
            return callback(null, foundUser, foundRegistration);
          },
          function (findUserError) {
            return callback(findUserError);
          }
        );
      },

      /* Api key is valid (not yet expired), so register a new identity with
       *  the user account, just don't confirm it yet. */
      function (foundUser, foundRegistration, callback) {

        if (foundUser.facultyIdentity == undefined) {
          User.model.addFacultyIdentity(foundUser._id, req.body.facultyIdentity,
            function (facultyIdentityUpdateError) {
              return callback(facultyIdentityUpdateError);
            });
        } else {
          User.model.updateFacultyIdentity(foundUser._id, req.body.facultyIdentity,
            function (facultyIdentityUpdateError) {
              return callback(facultyIdentityUpdateError);
            });
        }

        callback(null, foundRegistration);
      },

      /* Associate an identity secret in order to verify identity by email */
      function (foundRegistration, callback) {
        foundRegistration.generateIdentitySecret(
          function (identitySecretGenerationError) {
            if (identitySecretGenerationError) {
              return callback(identitySecretGenerationError);
            }
          },
          function (identitySecret) {
            return callback(null, foundRegistration, identitySecret);
          }
        );
      },
      
      /* Once an identity secret has been generated, email it to the provided facultyIdentity */
      
      function(registration, identitySecret, callback) {
        const emailMessage = EmailMessages.getIdentityConfirmationMessage(
          registration.facultyIdentity, identitySecret);
        
        Mailer.sendEmail(
          emailMessage,
          function(errorMessage) {
            return callback(errorMessage);
          },
          function() {
            return callback(null);
          }
        )
      }

    ], function (err, results) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(200);
        res.send();
      }
    });
  };

  return {
    invoke: _invoke
  }
})();

module.exports = RegisterIdentity;
