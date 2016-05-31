import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import {withRouter} from 'react-router';
import Utility from '../modules/utility'
import {REGISTER_ACCOUNT} from '../constants/routes';
import Alert from '../components-utility/Alert';

import {
  updateUserAccountData,
  showDangerAlert,
  hideDangerAlert,
  updateSuccess,
  updateError,
  showSuccessAlert,
  hideSuccessAlert
} from '../actions/actions';

let LoginRedirect = React.createClass({

  authResponse: {},

  getResponseFromQueryParams: function () {
    return JSON.parse(decodeURIComponent(window.location.href.split('?')[1]));
  },

  getAlertTypeFromAuthResponse(authResponse) {
    if (authResponse.error === true) return 'danger';
    return 'success';
  },

  getAlertComponentFromAuthResponse(authResponse) {
    let alertType = this.getAlertTypeFromAuthResponse(authResponse);

    if (authResponse.error === true) {
      return <Alert type={alertType} onClick={e => this.props.hideDangerAlert()} content={[
              {payload: <strong key="0">The authentication/authorization failed!</strong>, key: 0},
              {payload: <hr style={{width:"50%"}}/>, key: 1},
              {payload: <p key="2">{this.props.error.message}</p>, key: 2},
              {payload: <p key="3">{this.props.error.data}</p>, key: 3}
            ]} display={this.props.dangerAlert.display} />
    }

    return <Alert type={alertType} onClick={e => this.props.hideSuccessAlert()} content={[
              {payload: <strong key="0">Account registration successful! </strong>, key: 0},
              {payload: this.props.success.message, key: 1}
            ]} display={this.props.successAlert.display}/>
  },

  handleNoFacultyStatusAssociatedWithAccount() {
    if (this.authResponse.facultyStatus == undefined
      || this.authResponse.facultyStatus.length < 1) {
      this.props.updateError({message: "You don't have any faculty statuses associated with your account. " +
      "Please contact your administrator and ask for a faculty status association."});
      this.props.showDangerAlert();
    }
  },

  handleAuthResponseWithoutError() {
    this.props.updateUserAccountData(this.authResponse);
    this.handleNoFacultyStatusAssociatedWithAccount();

    if (!Utility.userAccountIsComplete(this.authResponse)) {
      this.context.router.push(REGISTER_ACCOUNT)
    } else {
      this.context.router.push(Utility.getRedirectLocation(this.authResponse.facultyStatus))
    }
  },

  handleAuthResponseWithError() {
    this.props.updateError({
      message: this.authResponse.message,
      data: this.authResponse.data
    });
    this.props.showDangerAlert();
  },

  /**************************************************/

  componentDidMount() {
    this.authResponse = this.getResponseFromQueryParams();

    if (this.authResponse.error !== true) {
      this.handleAuthResponseWithoutError();
    } else {
     this.handleAuthResponseWithError();
    }
  },

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          {this.getAlertComponentFromAuthResponse(this.authResponse)}
        </div>
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
    dangerAlert: state.reducers.dangerAlert,
    successAlert: state.reducers.successAlert,
    success: state.reducers.success,
    error: state.reducers.error
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    showDangerAlert: () => {
      dispatch(showDangerAlert());
    },
    hideDangerAlert: () => {
      dispatch(hideDangerAlert());
    },
    showSuccessAlert: () => {
      dispatch(showSuccessAlert());
    },
    hideSuccessAlert: () => {
      dispatch(hideSuccessAlert());
    },
    updateUserAccountData: (accountData) => {
      dispatch(updateUserAccountData(accountData));
    },
    updateSuccess: (successData) => {
      dispatch(updateSuccess(successData));
    },
    updateError: (errorData) => {
      dispatch(updateError(errorData));
    }
  }
};

LoginRedirect = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRedirect);

export default LoginRedirect;
