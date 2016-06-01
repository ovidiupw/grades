import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import {HOME} from '../constants/routes';

let SessionProblem = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  transitionToHomePage() {
    this.context.router.push(HOME);
  },

  render() {
    return (
      <div className="container-fluid">
        <blockquote>
          <div className="well" style={{fontSize:"0.8em"}}>
          <p>
            There was a problem with your session. Please go to the
            <a href="#" onClick={e => this.transitionToHomePage()} style={{marginLeft:5, marginRight:5}}>
              home page
            </a>
            and try to login again.
          </p>
            </div>
        </blockquote>
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

SessionProblem = connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionProblem);

export default SessionProblem
