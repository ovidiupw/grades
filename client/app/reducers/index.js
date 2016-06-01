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
  addRegistrationForm
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
  addRegistrationForm
});

export default reducers