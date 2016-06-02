const rest = require('rest');
const mime = require('rest/interceptor/mime');

import Utility from '../modules/utility';

import {
  showSpinner,
  hideSpinner,
  updateError,
  updateSuccess,
  showIdentityConfirmationForm,
  hideIdentityConfirmationForm,
  setRegistrations,
  setRoles,
  hideAddRegistrationForm,
  hideDangerAlert,
  hideSuccessAlert,
  showSuccessAlert
} from './actions';

let client = rest.wrap(mime, {
  mime: 'application/json'
});

let showSpinnerAndHideAlerts = function (dispatch) {
  dispatch(showSpinner());
  dispatch(hideDangerAlert());
  dispatch(hideSuccessAlert());
};

export function deleteRegistration(registrationWithAuthData, userAccount) {
  return dispatch => {
    showSpinnerAndHideAlerts(dispatch);

    client({
      method: 'DELETE',
      path: 'http://localhost:8082/v1/registrations',
      entity: registrationWithAuthData
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            dispatch(fetchRegistrations(userAccount));
            dispatch(hideAddRegistrationForm());
            dispatch(updateSuccess({
              message: "The following registration has been successfully deleted: ",
              data: JSON.stringify({
                'Faculty Identity': registrationWithAuthData.facultyIdentity,
                'Roles': registrationWithAuthData.roles,
                'Faculty Statuses': registrationWithAuthData.facultyStatus
              })
            }));
            dispatch(showSuccessAlert());
          }
          dispatch(hideSpinner());
        },

        errorResponse => {
          dispatch(updateError({
            message: errorResponse.status.text
          }));
          dispatch(hideSpinner());
        });
  };
}

export function addRegistration(registrationWithAuthData, userAccount) {
  return dispatch => {
    showSpinnerAndHideAlerts(dispatch);

    client({
      method: 'POST',
      path: 'http://localhost:8082/v1/registrations',
      entity: registrationWithAuthData
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            dispatch(fetchRegistrations(userAccount));
            dispatch(hideAddRegistrationForm());
            dispatch(updateSuccess({
              message: "A new registration has been added: ",
              data: JSON.stringify({
                'Faculty Identity': registrationWithAuthData.facultyIdentity,
                'Roles': registrationWithAuthData.roles,
                'Faculty Statuses': registrationWithAuthData.facultyStatus
              })
            }));
            dispatch(showSuccessAlert());
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
    showSpinnerAndHideAlerts(dispatch);

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
    showSpinnerAndHideAlerts(dispatch);

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
    showSpinnerAndHideAlerts(dispatch);
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
    showSpinnerAndHideAlerts(dispatch);

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
