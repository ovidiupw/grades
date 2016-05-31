import { connect } from 'react-redux'
import React, { PropTypes } from 'react';

let Roles = React.createClass({

  render() {
    return (
      <div>
        <h3>
          Roles
        </h3>
        <hr />
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
  }
};

Roles = connect(
  mapStateToProps,
  mapDispatchToProps
)(Roles);

export default Roles;
