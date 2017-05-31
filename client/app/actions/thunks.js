const rest = require('rest');
const mime = require('rest/interceptor/mime');

import Utility from '../modules/utility';
import * as Hostnames from '../constants/hostnames'

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
  showSuccessAlert,
  setApiResources,
  hideAddRoleForm
} from './actions';

let client = rest.wrap(mime, {
  mime: 'application/json'
});

let showSpinnerAndHideAlerts = function (dispatch) {
  dispatch(showSpinner());
  dispatch(hideDangerAlert());
  dispatch(hideSuccessAlert());
};

export function addRole(role, userAccount) {
  return dispatch => {
    showSpinnerAndHideAlerts(dispatch);

    client({
      method: 'POST',
      path: Hostnames.BACKEND_HOSTNAME + 'v1/roles',
      entity: {
        title: role.title,
        actions: role.actions,
        apiKey: userAccount.apiKey,
        user: userAccount.user
      }
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            dispatch(fetchRoles(userAccount));
            dispatch(hideAddRoleForm());
            dispatch(updateSuccess({
              message: "The following role has been successfully added: ",
              data: JSON.stringify({
                'Title': role.title,
                'Actions': JSON.stringify(role.actions)
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

export function fetchApiResources(userAccount) {
  return dispatch => {
    showSpinnerAndHideAlerts(dispatch);

    client({
      method: 'GET',
      path: Hostnames.BACKEND_HOSTNAME + 'v1/resources',
      headers: {
        user: userAccount.user,
        apiKey: userAccount.apiKey
      }
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            dispatch(setApiResources(response.entity));
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

export function deleteRegistration(registrationWithAuthData, userAccount) {
  return dispatch => {
    showSpinnerAndHideAlerts(dispatch);

    client({
      method: 'DELETE',
      path: Hostnames.BACKEND_HOSTNAME + 'v1/registrations',
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
      path: Hostnames.BACKEND_HOSTNAME + 'v1/registrations',
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
      path: Hostnames.BACKEND_HOSTNAME + 'v1/roles',
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
      path: Hostnames.BACKEND_HOSTNAME + 'v1/registrations',
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
      path: Hostnames.BACKEND_HOSTNAME + 'v1/register/identity',
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
      path: Hostnames.BACKEND_HOSTNAME + 'v1/register/identity',
      entity: confirmIdentityPayload
    })
      .then(
        response => {
          if (response.status.code !== 200) {
            Utility.handleResponseCodeNot200(response, dispatch);
          } else {
            window.open(BACKEND_HOSTNAME + 'v1/auth/facebook' +
              '?redirectUrl=' + FRONTEND_HOSTNAME + 'login-redirect', '_self');
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
