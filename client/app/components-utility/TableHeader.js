import { connect } from 'react-redux'
import React, { PropTypes } from 'react';

let TableHeader = React.createClass({

  propTypes: {
    columns: React.PropTypes.arrayOf(React.PropTypes.string),
    columnNames: React.PropTypes.objectOf(React.PropTypes.string)
  },

  render() {
    return (
      <tr>
        {this.props.columns.map((columnName, i) => <th key={i}>{this.props.columnNames[columnName]}</th>)}
      </tr>
    )
  }
});

const mapStateToProps = (state) => {
  return {
    userAccount: state.reducers.userAccount
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
  }
};

TableHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(TableHeader);

export default TableHeader;
