import {connect} from 'react-redux'
import {Link} from 'react-router'
import React, {PropTypes} from 'react';
import Authorization from '../modules/authorization';
import {HOME} from '../constants/routes';
import Utility from '../modules/utility';

import {
  updateUserAccountData
} from '../actions/actions'

let NavBarTop = React.createClass({

  handleLogout() {
    let clearedAccountData = Authorization.removeCredentialsFromLocalStorage();
    this.props.updateUserAccountData(clearedAccountData);

    FB.logout((response) => console.log(response));
    this.context.router.push(HOME)
  },

  handleRedirectToDashboard() {
    this.context.router.push(Utility.getRedirectLocation(this.props.userAccount.facultyStatus))
  },

  /*******************/

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render() {

    //TODO after refresh user name disappears - make a request to retrieve faculty identity

    let userDataDisplay = "none";
    if (this.props.userAccount.facultyIdentity != undefined) {
      userDataDisplay = "block";
    }

    let loggedInButtonsDisplay = "none";
    if (localStorage.getItem('user') != undefined) {
      loggedInButtonsDisplay = "block";
    }

    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <Link className="navbar-brand" to={'/home'}>
                <p>Grades</p>
              </Link>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1"
                 style={{display: loggedInButtonsDisplay}}>
              <ul className="nav navbar-nav" style={{display: loggedInButtonsDisplay}}>
                <li>
                  <a href="#" onClick={e => this.handleRedirectToDashboard()}>
                    Dashboard
                  </a>
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li>
                  <a href="#" style={{display: userDataDisplay, cursor:"default"}}>
                    Singed in as {this.props.userAccount.facultyIdentity}
                  </a>
                </li>
                <li>
                  <a href="#" style={{display: loggedInButtonsDisplay}}
                     onClick={e => this.handleLogout()}>
                    Logout
                  </a>
                </li>
                <li>
                  <a href="http://students.info.uaic.ro/~ovidiu.pricop/index.html"
                     target="_blank">
                    Help
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
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
    updateUserAccountData: (userAccount) => {
      dispatch(updateUserAccountData(userAccount));
    }
  }
};

NavBarTop = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBarTop);

export default NavBarTop;
