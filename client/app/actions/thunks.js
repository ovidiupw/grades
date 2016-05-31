const rest = require('rest');
const mime = require('rest/interceptor/mime');

import Utility from '../modules/utility';

import {
  showSpinner,
  hideSpinner,
  updateError,
  showIdentityConfirmationForm,
  hideIdentityConfirmationForm
} from './actions';

let client = rest.wrap(mime, {
  mime: 'application/json'
});


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
          console.log(response.status);
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