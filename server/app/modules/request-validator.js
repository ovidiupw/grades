'use strict';

let Errors = require('../constants/errors');
let Error = require('../modules/error');

const RouteNames = require('../constants/routes');

let RequestValidator = (function() {

  let _validateRegisterIdentityRequest = function(req, errCallback) {
    if (!req.body) {
      errCallback(new Error(
        Errors.REQ_BODY_INVALID.id,
        Errors.REQ_BODY_INVALID.message,
        "Unexpected body encoding supplied."
      ));
    }

    if (req.body.user == undefined
      || req.body.facultyIdentity == undefined
      || req.body.apiKey == undefined) {

        errCallback(new Error(
          Errors.REQ_BODY_INVALID.id,
          Errors.REQ_BODY_INVALID.message,
          "Required parameters not supplied. Please add both" +
          "'user', 'apiKey' and 'facultyIdentity' to your request."
        ));
    }
  };

  let _validateRequest = function(req, path, errCallback) {
    switch(path) {
      case RouteNames.REGISTER_IDENTITY:
        _validateRegisterIdentityRequest(req, errCallback);
        break;
    }
  };

  let _validateApiKey = function(user, requestKey, errCallback) {
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
  };

  return ({
    validateRequest: _validateRequest,
    validateApiKey: _validateApiKey
  });
})();

module.exports = RequestValidator;
