const rest = require('rest');
const mime = require('rest/interceptor/mime');

import Utility from '../modules/utility';

import {
  showSpinner,
  hideSpinner,
  updateError,
  showIdentityConfirmationForm,
  hideIdentityConfirmationForm,
  setRegistrations,
  setRoles,
  hideAddRegistrationForm
} from './actions';

let client = rest.wrap(mime, {
  mime: 'application/json'
});

export function addRegistration(registration, userAccount) {
  return dispatch => {
    dispatch(showSpinner());
    client({
      method: 'POST',
      path: 'http://localhost:8082/v1/registrations',
      entity: registration
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            dispatch(fetchRegistrations(userAccount));
            dispatch(hideAddRegistrationForm());
          }
          dispatch(hideSpinner());
        },

        errorResponse => {
          dispatch(updateError({
            message: errorResponse.status.text
          }));
          dispatch(hideSpinner());
        });
  }
}

export function fetchRoles(userAccount) {
  return dispatch => {
    dispatch(showSpinner());
    client({
      method: 'GET',
      path: 'http://localhost:8082/v1/roles',
      headers: {
        'user' : userAccount.user,
        'apiKey' : userAccount.apiKey
      }
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            dispatch(setRoles(response.entity));
          }
          dispatch(hideSpinner());
        },

        errorResponse => {
          dispatch(updateError({
            message: errorResponse.status.text
          }));
          dispatch(hideSpinner());
        });
  }
}



export function fetchRegistrations(userAccount) {
  return dispatch => {
    dispatch(showSpinner());
    client({
      method: 'GET',
      path: 'http://localhost:8082/v1/registrations',
      headers: {
        'user' : userAccount.user,
        'apiKey' : userAccount.apiKey
      }
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            dispatch(setRegistrations(response.entity));
          }
          dispatch(hideSpinner());
        },

        errorResponse => {
          dispatch(updateError({
            message: errorResponse.status.text
          }));
          dispatch(hideSpinner());
        });
  }
}

export function registerIdentity(accountData) {
  return dispatch => {
    dispatch(showSpinner());
    dispatch(hideIdentityConfirmationForm());

    client({
      method: 'POST',
      path: 'http://localhost:8082/v1/register/identity',
      entity: accountData
    })
      .then(
        response => {
          console.log(response.status);
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            dispatch(showIdentityConfirmationForm());
          }
          dispatch(hideSpinner());
        },

        errorResponse => {
          dispatch(updateError({
            message: errorResponse.status.text
          }));
          dispatch(hideSpinner());
        });
  }
}

export function confirmIdentity(accountData, confirmIdentityPayload) {
  return dispatch => {
    dispatch(showSpinner());
    client({
      method: 'PUT',
      path: 'http://localhost:8082/v1/register/identity',
      entity: confirmIdentityPayload
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            window.open('http://localhost:8082/v1/auth/facebook', '_self')
          }
          dispatch(hideSpinner());
        },

        errorResponse => {
          dispatch(updateError({
            message: errorResponse.status.text
          }));
          dispatch(hideSpinner());
        });
  }
}
