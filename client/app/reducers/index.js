import { combineReducers } from 'redux'
import {todoItems} from './reducers'

const reducers = combineReducers({
  todoItems
});

export default reducers