import * as ActionTypes from '../constants/actionTypes'
import * as InitialStates from '../constants/initialStates'

export function successAlert(state = {
  display: "none"
}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_SUCCESS_ALERT:
      return {
        display: "block"
      };
    case ActionTypes.HIDE_SUCCESS_ALERT:
      return {
        display: "none"
      };
    default:
      return state;
  }
}

export function dangerAlert(state = {
  display: "none"
}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_DANGER_ALERT:
      return {
        display: "block"
      };
    case ActionTypes.HIDE_DANGER_ALERT:
      return {
        display: "none"
      };
    default:
      return state;
  }
}

export function userAccount(state = {
  user: undefined,
  facultyIdentity: undefined,
  identityConfirmed: undefined,
  apiKey: undefined,
  keyExpires: undefined,
  facultyStatus: undefined
}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_USER_ACCOUNT_DATA:

      const acc = action.accountData;
      return Object.assign({}, state, {
        user: acc.user,
        facultyIdentity: acc.facultyIdentity,
        identityConfirmed: acc.identityConfirmed,
        apiKey: acc.apiKey,
        keyExpires: acc.keyExpires,
        facultyStatus: acc.facultyStatus
      });
    default:
      return state;
  }
}

export function success(state = {
  message: undefined,
  data: undefined
}, action) {
  switch (action.type) {

    case ActionTypes.UPDATE_SUCCESS:

      const succ = action.successData;
      return Object.assign({}, state, {
        message: succ.message,
        data: succ.data
      });

    default:
      return state;
  }
}

export function error(state = {
  id: undefined,
  message: undefined,
  data: undefined
}, action) {
  switch (action.type) {
    
    case ActionTypes.UPDATE_ERROR:
      const err = action.errorData;
      return Object.assign({}, state, {
        id: err.id,
        message: err.message,
        data: err.data
      });

    default:
      return state;
  }
}

export function spinner(state = {
  stopped: true
}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_SPINNER:
      return Object.assign({}, state, {
        stopped: false
      });
    
    case ActionTypes.HIDE_SPINNER:
      return Object.assign({}, state, {
        stopped: true
      });

    default:
      return state;
  }
}

export function identityConfirmationForm(state = {
  display: "none"
}, action) {
  switch (action.type) {
    case ActionTypes.SHOW_IDENTITY_CONFIRMATION_FORM:
      return Object.assign({}, state, {
        display: "block"
      });

    case ActionTypes.HIDE_IDENTITY_CONFIRMATION_FORM:
      return Object.assign({}, state, {
        display: "none"
      });

    default:
      return state;
  }
}

export function registrations(state = {
  items: []
}, action) {
  switch (action.type) {
    case ActionTypes.SET_REGISTRATIONS:
      return Object.assign({}, state, {
        items: action.registrations    
      });
    
    default:
      return state;
  }
}

export function roles(state = {
  items: []
}, action) {
  switch (action.type) {
    case ActionTypes.SET_ROLES:
      return Object.assign({}, state, {
        items: action.roles
      });

    default:
      return state;
  }
}

export function apiResources(state = {
  items: []
}, action) {
  switch (action.type) {
    case ActionTypes.SET_API_RESOURCES:
      return Object.assign({}, state, {
        items: action.apiResources
      });

    default:
      return state;
  }
}

export function addRoleForm(state = InitialStates.addRoleForm
  , action) {
  switch (action.type) {

    case ActionTypes.UPDATE_ADD_ROLE_FORM_TITLE:
      return Object.assign({}, state, { 
        title: action.title
      });

    case ActionTypes.POP_ADD_ROLE_FORM_ACTION:
      return Object.assign({}, state, {
        actions: state.actions.filter(currentAction =>
        currentAction.verb !== action.action.verb || currentAction.resource !== action.action.resource)
      });

    case ActionTypes.PUSH_ADD_ROLE_FORM_ACTION:
      let actionsWithNewAction = state.actions;
      actionsWithNewAction.push(action.action);

      return Object.assign({}, state, {
        actions: actionsWithNewAction
      });

    case ActionTypes.SHOW_ADD_ROLE_FORM:
      return Object.assign({}, state, {
        display: "block"
      });

    case ActionTypes.HIDE_ADD_ROLE_FORM:
      return Object.assign({}, state, {
        display: "none"
      });

    default:
      return state;
  }
}

export function addRegistrationForm(state = InitialStates.addRegistrationForm
  , action) {
  switch (action.type) {

    case ActionTypes.UPDATE_ADD_REGISTRATION_FORM_FACULTY_STATUSES:
      return Object.assign({}, state, {
        facultyStatuses: action.facultyStatuses
      });

    case ActionTypes.UPDATE_ADD_REGISTRATION_FORM_FACULTY_IDENTITY:
      return Object.assign({}, state, {
        facultyIdentity: action.facultyIdentity
      });

    case ActionTypes.POP_ADD_REGISTRATION_FORM_ROLE:
      return Object.assign({}, state, {
        roles: state.roles.filter(role => role.title !== action.role.title)
      });

    case ActionTypes.PUSH_ADD_REGISTRATION_FORM_ROLE:
      let rolesWithNewRole = state.roles;
      rolesWithNewRole.push(action.role);

      return Object.assign({}, state, {
        roles: rolesWithNewRole
      });

    case ActionTypes.CLEAR_ADD_REGISTRATION_FORM_ROLES:
      return Object.assign({}, state, {
        roles: []
      });

    case ActionTypes.SHOW_ADD_REGISTRATION_FORM:
      return Object.assign({}, state, {
        display: "block"
      });
    
    case ActionTypes.HIDE_ADD_REGISTRATION_FORM:
      return Object.assign({}, state, {
        display: "none"
      });
    
    default:
      return state;
  }
}
