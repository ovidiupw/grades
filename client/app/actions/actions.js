import * as Actions from '../constants/actionTypes'

export function setApiResources(apiResources) {
  return {
    type: Actions.SET_API_RESOURCES,
    apiResources: apiResources
  }
}

export function updateRegistrationFormFacultyStatuses(facultyStatuses) {
  return {
    type: Actions.UPDATE_ADD_REGISTRATION_FORM_FACULTY_STATUSES,
    facultyStatuses: facultyStatuses
  }
}

export function updateRegistrationFormFacultyIdentity(facultyIdentity) {
  return {
    type: Actions.UPDATE_ADD_REGISTRATION_FORM_FACULTY_IDENTITY,
    facultyIdentity: facultyIdentity
  }
}

export function removeRegistrationFormRole(role) {
  return {
    type: Actions.POP_ADD_REGISTRATION_FORM_ROLE,
    role: role
  }
}

export function addRegistrationFormRole(role) {
  return {
    type: Actions.PUSH_ADD_REGISTRATION_FORM_ROLE,
    role: role
  }
}

export function updateRoleFormTitle(title) {
  return {
    type: Actions.UPDATE_ADD_ROLE_FORM_TITLE,
    title: title
  }
}

export function removeRoleFormAction(action) {
  return {
    type: Actions.POP_ADD_ROLE_FORM_ACTION,
    action: action
  }
}

export function addRoleFormAction(action) {
  return {
    type: Actions.PUSH_ADD_ROLE_FORM_ACTION,
    action: action
  }
}

export function clearRegistrationFormRoles() {
  return {
    type: Actions.CLEAR_ADD_REGISTRATION_FORM_ROLES
  };
}

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

export function setRegistrations(registrations) {
  return {
    type: Actions.SET_REGISTRATIONS,
    registrations: registrations
  }
}


export function setRoles(roles) {
  return {
    type: Actions.SET_ROLES,
    roles: roles
  }
}

export function showAddRegistrationForm() {
  return {
    type: Actions.SHOW_ADD_REGISTRATION_FORM
  }
}

export function hideAddRegistrationForm() {
  return {
    type: Actions.HIDE_ADD_REGISTRATION_FORM
  }
}

export function showAddRoleForm() {
  return {
    type: Actions.SHOW_ADD_ROLE_FORM
  }
}

export function hideAddRoleForm() {
  return {
    type: Actions.HIDE_ADD_ROLE_FORM
  }
}