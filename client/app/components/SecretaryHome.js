import { connect } from 'react-redux'
import React, { PropTypes } from 'react';


let SecretaryHome = React.createClass({

  render() {
    return (
      <div>
        <h3>
          Secretary Dashboard Panel
        </h3>
        <hr />
        <blockquote>
          This is the secretary panel. You can add or remove students by choosing the 'students' category from the left
          panel
        </blockquote>
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

SecretaryHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(SecretaryHome);

export default SecretaryHome
