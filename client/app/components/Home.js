import { connect } from 'react-redux'
import React, { PropTypes } from 'react';

import { 
  textCenter 
} from '../styles/generic-styles'

/**
 Creates a container for the application's components.
 */
let Home = React.createClass({

  handleAuthViaFacebook() {
    window.open('http://localhost:8082/v1/auth/facebook' +
      '?redirectUrl=http://localhost:3000/login-redirect', '_self')
  },
  
  componentDidMount() {
    if (window.localStorage == undefined)
      alert('Your browser needs local-storage support! Please update your browser');
  },

  render() {
    return (
      <div>
        <div className="jumbotron" style={textCenter}>
          <div style={{marginBottom:40}}>
            <h1>Grades</h1>
            <p>University grade management made simple</p>
          </div>
          <p>
            <a className="btn btn-primary btn-lg"
               href="#"
               role="button"
               onClick={e => this.handleAuthViaFacebook()}>
              Login and use the app
            </a>
          </p>
        </div>
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

Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default Home
