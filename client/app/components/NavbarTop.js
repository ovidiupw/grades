import { connect } from 'react-redux'
import { Link } from 'react-router'
import React, {PropTypes} from 'react';
import Authorization from '../modules/authorization';
import {HOME} from '../constants/routes';

import {
  updateUserAccountData
} from '../actions/actions'

let NavBarTop = React.createClass ({

  handleLogout() {
    let clearedAccountData = Authorization.removeCredentialsFromLocalStorage();
    this.props.updateUserAccountData(clearedAccountData);

    FB.logout((response) => console.log(response));
    this.context.router.push(HOME)
  },

  /*******************/

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render() {

    let userDataDisplay = "none";
    if (this.props.userAccount.facultyIdentity != undefined) {
      userDataDisplay = "block";
    }

    let logoutButtonDisplay = "none";
    if ( localStorage.getItem('user') != undefined) {
      logoutButtonDisplay = "block";
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

          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#" style={{display: userDataDisplay, cursor:"default"}}>
                Singed in as {this.props.userAccount.facultyIdentity}
              </a>
            </li>
            <li>
              <a href="#" style={{display: logoutButtonDisplay}}
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
      </nav>
    </div>
  )}
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
