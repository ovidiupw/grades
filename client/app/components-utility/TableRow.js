import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import {SpecialColumns} from '../constants/tables';
import Action from '../components-utility/Action'

let TableRow = React.createClass({

  getTableCell(columnName, i) {
    if (columnName == SpecialColumns.DELETE_BUTTON) {
      return (
        <td>
          <button type="button" className="btn btn-xs" aria-label="Left Align"
                  onClick={this.props.deleteButtonHandler}>
            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
          </button>
        </td>
      );
    }

    if (this.props.actionsFormatterColumnName != undefined) {
      if (columnName === this.props.actionsFormatterColumnName) {
        return (
          <td>
            {this.props.columnData[columnName].map(action => <Action action={action} />)}
          </td>
        );
      }
    }

    let dataToDisplay = this.props.columnData[columnName];
    if (this.props.columnData[columnName].constructor === Array) {
      dataToDisplay = dataToDisplay.map(data => data + ", ");
    }

    return <td key={i}>{dataToDisplay}</td>;
  },

  /*********************************/

  propTypes: {
    columns: React.PropTypes.arrayOf(React.PropTypes.string),
    columnData: React.PropTypes.object
  },

  render() {
    return (
      <tr>
        {
          this.props.columns.map((columnName, i) => {
            return this.getTableCell(columnName, i);
          })
        }
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
  return {}
};

TableRow = connect(
  mapStateToProps,
  mapDispatchToProps
)(TableRow);

export default TableRow;
