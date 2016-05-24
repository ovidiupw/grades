'use strict';

const Errors = {
  FB_ACCOUNT_NOT_VERIFIED: {
    id: 1,
    message: 'Error: Your facebook account needs to be verified.',
    data: undefined
  },
  REQ_BODY_INVALID: {
    id: 2,
    message: 'Error: The request body you supplied is invalid.',
    data: undefined
  },
  LOGIN_ERROR: {
    id: 3,
    message: 'Error: Could not log in.',
    data: undefined
  },
  USER_NOT_FOUND: {
    id: 4,
    message: 'Error: Supplied user could not be found.',
    data: undefined
  },
  DATABASE_ACCESS_ERROR: {
    id: 5,
    message: 'Error: Database operation failed.',
    data: undefined
  },
  API_KEY_EXPIRED: {
    id: 6,
    message: 'Error: The api key you provided expired.',
    data: undefined
  },
  API_KEY_INVALID: {
    id: 7,
    message: 'Error: The api key you provided is invalid.',
    data: undefined
  },
  IDENTITY_CONFIRMATION_FAILED: {
    id: 8,
    message: 'Error: The identity confirmation failed.',
    data: undefined
  },
  ROLE_NOT_FOUND: {
    id: 9,
    message: 'Error: The role with the supplied title was not found.',
    data: undefined
  },
  AUTHORIZATION_DATA_NOT_FOUND: {
    id: 10,
    message: 'Error: Authorization data not found in request.',
    data: undefined
  },
  NOT_AUTHORIZED: {
    id: 11,
    message: 'Error: The supplied user is not authorized to perform this operation.',
    data: undefined
  },
  REGISTRATION_NOT_FOUND: {
    id: 12,
    message: 'Error: The registration with the supplied facultyIdentity was not found.',
    data: undefined
  },
  INVALID_ROLE: {
    id: 13,
    message: 'Error: A supplied role was invalid - not configured.',
    data: undefined
  },
INVALID_REQUEST_FIELDS: {
    id: 14,
    message: 'The fields of the object you passed in your request did not validate successfully.',
    data: undefined
  },
  IDENTITY_NOT_CONFIRMED: {
    id: 15,
    message: 'The account requesting the operation is not confirmed.',
    data: undefined
  },
  AUTHENTICATION_ERROR: {
    id: 16,
    message: 'There was an error while authenticating.',
    data: undefined
  },
  USER_ALREADY_EXISTS: {
    id: 17,
    message: 'Error: Supplied user already exists.',
    data: undefined
  },
  INVALID_REQUEST_DATA: {
    id: 18,
    message: 'Error: Invalid request data supplied.',
    data: undefined
  },
  USER_REGISTRATION_ERROR: {
    id: 19,
    message: 'Error: Registration could not be completed.',
    data: undefined
  }


};

module.exports = Errors;
