import { combineReducers } from 'redux'
import {
  dangerAlert,
  successAlert,
  userAccount,
  error,
  success,
  spinner,
  identityConfirmationForm,
  registrations,
  roles,
  addRegistrationForm,
  addRoleForm,
  apiResources
} from './reducers'

const reducers = combineReducers({
  dangerAlert,
  successAlert,
  userAccount,
  error,
  success,
  spinner,
  identityConfirmationForm,
  registrations,
  roles,
  addRegistrationForm,
  addRoleForm,
  apiResources
});

export default reducers