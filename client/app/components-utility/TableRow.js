import { connect } from 'react-redux'
import React, { PropTypes } from 'react';

let TableHeader = React.createClass({

  propTypes: {
    columns: React.PropTypes.arrayOf(React.PropTypes.string),
    columnData: React.PropTypes.object
  },

  render() {
    return (
      <tr>
        {
          this.props.columns.map((columnName, i) => {
            let dataToDisplay = this.props.columnData[columnName];
            if (this.props.columnData[columnName].constructor === Array) {
              dataToDisplay = dataToDisplay.map(data => data + ", ");
            }
            return <td key={i}>{dataToDisplay}</td>;
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
  return {
  }
};

TableHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(TableHeader);

export default TableHeader;
