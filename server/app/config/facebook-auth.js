'use strict';

const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../entities/user');
const Registration = require('../entities/registration');
const ConfigAuth = require('./auth');

const Errors = require('../constants/errors');
const Error = require('../modules/error');
let async = require('async');


let FacebookAuth = (function () {

  let _facebookStrategy = new FacebookStrategy({
      clientID: ConfigAuth.facebookAuth.appId,
      clientSecret: ConfigAuth.facebookAuth.appSecret,
      callbackURL: ConfigAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'name', 'verified'] /* get only these fields from profile */
    },
    function (accessToken, refreshToken, profile, done) {

      process.nextTick(() => {
        if (profile._json.verified === false) {
          /* Do not accept unverified facebook profiles */
          return done(new Error(
            Errors.FB_ACCOUNT_NOT_VERIFIED.id,
            Errors.FB_ACCOUNT_NOT_VERIFIED.message
          ));
        }

        let apiKeyExpiration = new Date();
        apiKeyExpiration.setHours(apiKeyExpiration.getHours() + 1);
        let userIdentity = profile._json.id + '@' + profile.provider;

        return _createOrUpdateUser(userIdentity, accessToken, apiKeyExpiration, done)
      });
    });

  let _createNewUserAndSetIdentityConfirmedToFalse = function (userIdentity, accessToken, apiKeyExpiration) {
    /* User is not in database, add it and set identityConfirmed to false */
    let user = new User.model({
      user: userIdentity,
      apiKey: accessToken,
      keyExpires: apiKeyExpiration,
      identityConfirmed: false
    });

    user.save(function (err) {
      if (err) {
        return new Error(
          Errors.LOGIN_ERROR.id,
          Errors.LOGIN_ERROR.message
        );
      }
    });
  };

  let _updateUserWithNewCredentials = function (foundUser, accessToken, apiKeyExpiration) {

    User.model.update({
      _id: foundUser._id
    }, {
      $set: {
        apiKey: accessToken,
        keyExpires: apiKeyExpiration
      }
    }, function (err) {
      if (err) {
        return new Error(
          Errors.LOGIN_ERROR.id,
          Errors.LOGIN_ERROR.message
        );
      }
    });
  };

  let _createOrUpdateUser = function (userIdentity, accessToken, apiKeyExpiration, done) {

    async.waterfall([

      /* Create or update the user */

      function (callback) {
        User.model.findOne({
          user: userIdentity
        }, function (err, foundUser) {
          if (err) {
            return callback(new Error(
              Errors.LOGIN_ERROR.id,
              Errors.LOGIN_ERROR.message
            ));
          }

          if (!foundUser) {
            let executionError = _createNewUserAndSetIdentityConfirmedToFalse(
              userIdentity, accessToken, apiKeyExpiration);
            if (executionError != undefined) {
              return callback(executionError)
            }

          } else {
            let executionError = _updateUserWithNewCredentials(
              foundUser, accessToken, apiKeyExpiration);
            if (executionError != undefined) {
              return callback(executionError)
            }
          }

          return callback(null, userIdentity)
        });
      },

      /* Return the updated/created user */

      function (userIdentity, callback) {
        User.model.findOne({
          user: userIdentity
        }, function (err, foundUser) {
          if (err || !foundUser) {
            return callback(new Error(
              Errors.LOGIN_ERROR.id,
              Errors.LOGIN_ERROR.message
            ));
          }
          return callback(null, foundUser);
        });
      },

      /* If user has it's identity confirmed, then append facultyStatus to response */

      function (user, callback) {
        if (user.identityConfirmed === false) {
          return callback(null, user, null);
        }
        Registration.model.findByFacultyIdentity(
          user.facultyIdentity,
          function (foundRegistration) {
            return callback(null, user, foundRegistration);
          },
          function (registrationFindError) {
            return callback(registrationFindError);
          });

      },

      function (user, userRegistration, callback) {
        let responseObject = {
          user: userIdentity,
          apiKey: accessToken,
          keyExpires: apiKeyExpiration,
          identityConfirmed: user.identityConfirmed,
          facultyIdentity: user.facultyIdentity
        };

        if (userRegistration != null) {
          responseObject = Object.assign({}, responseObject, {
            facultyStatus: userRegistration.facultyStatus
          })
        }

        callback(null, responseObject);
      }


    ], function (err, result) {
      if (err) {
        return done(err)
      } else {
        return done(null, result);
      }
    });

  };

  return ({
    facebookStrategy: _facebookStrategy
  });

})();

module.exports = FacebookAuth;
