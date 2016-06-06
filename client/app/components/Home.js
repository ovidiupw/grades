import {connect} from 'react-redux'
import React, {PropTypes} from 'react';

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
              Authenticate
            </a>
          </p>
        </div>
        <div className="container-fluid" style={{marginBottom:50}}>
          <div className="row">
            <div className="col-md-2">
            </div>
            <div className="col-md-8" style={{textAlign:'center'}}>
              <hr/>
              <p>
                Grades is an education-oriented web platform designed for managing student evaluation.
                Grades comes to rescue the traditional problem of having no centralized place to
                view, add and manage student university grades.
              </p>
              <a href="http://students.info.uaic.ro/~ovidiu.pricop/index.html"
                 target="_blank">
                Learn more about Grades
              </a>
            </div>
            <div className="col-md-2">
            </div>
          </div>
        </div>
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

export default Home
