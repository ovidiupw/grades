import * as Actions from '../constants/actionTypes'

export function showSuccessAlert() {
  return {
    type: Actions.SHOW_SUCCESS_ALERT
  }
}

export function hideSuccessAlert() {
  return {
    type: Actions.HIDE_SUCCESS_ALERT
  }
}

export function showDangerAlert() {
  return {
    type: Actions.SHOW_DANGER_ALERT
  }
}

export function hideDangerAlert() {
  return {
    type: Actions.HIDE_DANGER_ALERT
  }
}

export function updateUserAccountData(accountData) {
  return {
    type: Actions.UPDATE_USER_ACCOUNT_DATA,
    accountData: accountData
  };
}

export function updateError(errorData) {
  return {
    type: Actions.UPDATE_ERROR,
    errorData: errorData
  };
}

export function updateSuccess(successData) {
  return {
    type: Actions.UPDATE_SUCCESS,
    successData: successData
  };
}

export function showSpinner() {
  return {
    type: Actions.SHOW_SPINNER
  };
}

export function hideSpinner() {
  return {
    type: Actions.HIDE_SPINNER
  };
}

export function showIdentityConfirmationForm() {
  return {
    type: Actions.SHOW_IDENTITY_CONFIRMATION_FORM
  }
}

export function hideIdentityConfirmationForm() {
  return {
    type: Actions.HIDE_IDENTITY_CONFIRMATION_FORM
  }
}