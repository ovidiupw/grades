import * as Actions from '../constants/actionTypes'

let nextTodoId = 0;

export default function addTodo() {
  return {
    type: Actions.ADD_TODO,
    id: nextTodoId++
  }
};