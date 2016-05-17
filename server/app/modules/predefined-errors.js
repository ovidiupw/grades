'use strict';

let Errors = require('../constants/errors');
let Error = require('../modules/error');

let PredefinedErrors = {
  
  getAuthorizationDataNotFoundError: function () {
    return new Error(
      Errors.AUTHORIZATION_DATA_NOT_FOUND.id,
      Errors.AUTHORIZATION_DATA_NOT_FOUND.message,
      undefined
    );
  },
  
  getInvalidBodyError: function() {
    return new Error(
      Errors.REQ_BODY_INVALID.id,
      Errors.REQ_BODY_INVALID.message,
      "Unexpected body encoding supplied."
    );
  }
  
};

module.exports = PredefinedErrors;