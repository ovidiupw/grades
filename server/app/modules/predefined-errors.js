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
  },

  getAddNewRegistrationError: function(data) {
    return new Error(
      Errors.USER_REGISTRATION_ERROR.id,
      Errors.USER_REGISTRATION_ERROR.message,
      data
    )
  },

  getFacultyIdentityError: function(data) {
    return new Error(
      Errors.INVALID_FACULTY_IDENTITY.id,
      Errors.INVALID_FACULTY_IDENTITY.message,
      data
    )
  },

  getBirthDateError: function(data) {
    return new Error(
      Errors.INVALID_BIRTH_DATE.id,
      Errors.INVALID_BIRTH_DATE.message,
      data
    )
  },

  getProfessorFacultyIdentityError: function(data) {
    return new Error(
      Errors.PROFESSOR_NOT_FOUND.id,
      Errors.PROFESSOR_NOT_FOUND.message,
      data
    )
  },

  getCourseIdError: function(data) {
    return new Error(
      Errors.COURSE_NOT_FOUND.id,
      Errors.COURSE_NOT_FOUND.message,
      data
    )
  },

  getInvalidHeaderError: function(data) {
    return new Error(
      Errors.REQ_HEADER_INVALID.id,
      Errors.REQ_HEADER_INVALID.message,
      data
    )
  }

};

module.exports = PredefinedErrors;