import { connect } from 'react-redux'
import React, { PropTypes } from 'react';

let Registrations = React.createClass({

  render() {
    return (
      <div>
        <h3>
          Registrations
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

Registrations = connect(
  mapStateToProps,
  mapDispatchToProps
)(Registrations);

export default Registrations;
