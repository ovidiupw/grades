import * as ActionTypes from '../constants/actionTypes'

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
  message: undefined
}, action) {
  switch (action.type) {

    case ActionTypes.UPDATE_SUCCESS:

      const succ = action.successData;
      return Object.assign({}, state, {
        message: succ.message
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
