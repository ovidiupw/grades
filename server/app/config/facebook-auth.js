'use strict';

const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../entities/user');
const ConfigAuth = require('./auth');

const Errors = require('../constants/errors');
const Error = require('../modules/error');

let FacebookAuth = (function() {

  let _facebookStrategy = new FacebookStrategy({
      clientID: ConfigAuth.facebookAuth.appId,
      clientSecret: ConfigAuth.facebookAuth.appSecret,
      callbackURL: ConfigAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'name', 'verified'], /* get only these fields from profile */
    },
    function(accessToken, refreshToken, profile, done) {
      /* Wait for the next process event loop via process.nextTick */
      process.nextTick(function() {
        if (profile._json.verified === false) {
          /* Do not accept unverified facebook profiles */
          return done(new Error(
            Errors.FB_ACCOUNT_NOT_VERIFIED.id, Errors.FB_ACCOUNT_NOT_VERIFIED.message));
        }

        let apiKeyExpiration = new Date();
        apiKeyExpiration.setHours(apiKeyExpiration.getHours() + 1);

        const userIdentity = profile._json.id + '@' + profile.provider;
        let identityConfirmed = false;

        User.model.findOne({
          user: userIdentity
        }, function(err, foundUser) {
          if (err) {
            return done(new Error(
              Errors.LOGIN_ERROR.id, Errors.LOGIN_ERROR.message), "err");
          }

          if (!foundUser) {
            /* User is not in database, add it and set identityConfirmed to false */
            let user = new User.model({
              user: userIdentity,
              apiKey: accessToken,
              keyExpires: apiKeyExpiration,
              identityConfirmed: false
            });
            user.save(function(err) {
              if (err) {
                return done(new Error(
                  Errors.LOGIN_ERROR.id, Errors.LOGIN_ERROR.message), err);
              }
            });

          } else {
            /* User already is in database, only update auth credentials */
            identityConfirmed = foundUser.identityConfirmed;

            User.model.update({
              _id: foundUser._id
            }, {
              $set: {
                apiKey: accessToken,
                keyExpires: apiKeyExpiration
              }
            }, function(err) {
              if (err) {
                return done(new Error(
                  Errors.LOGIN_ERROR.id, Errors.LOGIN_ERROR.message), err);
              }
            });
          }
        }); /* end User.model.findOne callback */

        return done(null, {
          user: userIdentity,
          accessToken: accessToken,
          accessTokenExpires: apiKeyExpiration,
          identityConfirmed: identityConfirmed
        });

      });
    });

  return ({
    facebookStrategy: _facebookStrategy
  });

})();

module.exports = FacebookAuth;
