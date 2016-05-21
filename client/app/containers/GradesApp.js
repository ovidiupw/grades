import { connect } from 'react-redux'
import React, {PropTypes} from 'react';

import NavbarTop from '../components/NavbarTop'
import TodoItem from '../components/TodoItem'

import addTodo from '../actions/actions'

/**
  Creates a container for the application's components.
*/
let GradesApp = React.createClass({

  handleAddTodoItem() {
    console.log("Adaugam todo item");
    this.props.addTodo();
  },

  render() {
    const todoItems = this.props.todoItems;
console.log(todoItems)
    return (
    <div>
      <NavbarTop />
      <button type="submit" className="btn btn-default" onClick={e => this.handleAddTodoItem()}>
      Add Todo Item
      </button>
      {todoItems.map(todoItem =>
          <TodoItem key={todoItem.id} text={todoItem.text} />
      )}
    </div>

  )}
});

const mapStateToProps = (state) => {
  return {
    todoItems: state.reducers.todoItems.todoItems
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTodo: () => {
      dispatch(addTodo());
    }
  }
};

GradesApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(GradesApp);

export default GradesApp
