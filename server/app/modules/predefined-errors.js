'use strict';

let Errors = require('../constants/errors');
let Error = require('../modules/error');

let PredefinedErrors = {
  
  getAuthorizationDataNotFoundError: function () {
    return new Error(
      Errors.AUTHENTICATION_DATA_NOT_FOUND.id,
      Errors.AUTHENTICATION_DATA_NOT_FOUND.message,
      undefined
    );
  },
  
  getInvalidBodyError: function(data) {
    return new Error(
      Errors.REQ_BODY_INVALID.id,
      Errors.REQ_BODY_INVALID.message,
      data
    );
  },
  
  getNotAuthorizedError: function(data) {
    return new Error(
      Errors.NOT_AUTHORIZED.id,
      Errors.NOT_AUTHORIZED.message,
      data
    );
  },
  
  getDatabaseOperationFailedError: function(data) {
    return new Error(
      Errors.INVALID_REQUEST_FIELDS.id,
      Errors.INVALID_REQUEST_FIELDS.message,
      data
    )
  },
  
  getIdentityConfirmationError: function(data) {
    return new Error(
      Errors.IDENTITY_CONFIRMATION_FAILED.id,
      Errors.IDENTITY_CONFIRMATION_FAILED.message,
      data
    )
  }
  
};

module.exports = PredefinedErrors;