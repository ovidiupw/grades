import { connect } from 'react-redux'
import React, { PropTypes } from 'react';


let DeveloperHome = React.createClass({

  render() {
    return (
      <div>
        <h3>
          Developer Dashboard Panel
        </h3>
        <hr />
        <blockquote>
          This is the developer panel. You can configure new registrations and roles by choosing
          a suitable category from the left sidebar.
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

DeveloperHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeveloperHome);

export default DeveloperHome
