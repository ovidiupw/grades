import * as ActionTypes from '../constants/actionTypes'

export function todoItems(state = {
  todoItems: []
}, action) {
  console.log(state);
  switch (action.type) {
    case ActionTypes.ADD_TODO:

      let newTodoItems = [];
      state.todoItems.forEach(todoItem => newTodoItems.push(todoItem));
      newTodoItems.push({
        id: action.id,
        text: ""
      });
      
      return Object.assign(
        {},
        state,
        {
          todoItems: newTodoItems
        }
      );
    default:
      return state;
  }
}
