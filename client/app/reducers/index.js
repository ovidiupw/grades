import { combineReducers } from 'redux'
import {
  dangerAlert,
  successAlert,
  userAccount,
  error,
  success,
  spinner,
  identityConfirmationForm
} from './reducers'

const reducers = combineReducers({
  dangerAlert,
  successAlert,
  userAccount,
  error,
  success,
  spinner,
  identityConfirmationForm
});

export default reducers