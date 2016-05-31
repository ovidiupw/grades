import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import {REGISTER_ACCOUNT, EMAIL_CONFIRMATION} from '../constants/text';
import ReactTooltip from 'react-tooltip'
import Alert from '../components-utility/Alert'
import Spinner from 'react-spin'

import {
  updateError,
  updateSuccess,
  updateUserAccountData,
  hideSuccessAlert,
  hideDangerAlert,
  showDangerAlert,
  showSuccessAlert,
  showIdentityConfirmationForm
} from '../actions/actions';

import {
  registerIdentity,
  confirmIdentity
} from '../actions/thunks';

let RegisterAccount = React.createClass({
  
  hideAlerts() {
    this.props.hideDangerAlert();
    this.props.hideSuccessAlert();
  },

  handleRegisterAccountSubmit() {
    this.hideAlerts();

    if (this.refs.facultyIdentity.value == undefined || this.refs.facultyIdentity.value.length < 1) {
      this.props.updateError({
        message: "Faculty identity must be defined. Please input a valid faculty identity."
      });
      this.props.showDangerAlert();
      return;
    }

    let updatedUserAccount = {};
    Object.assign(updatedUserAccount, this.props.userAccount, {
      facultyIdentity: this.refs.facultyIdentity.value
    });

    this.props.updateUserAccountData(updatedUserAccount);
    this.props.registerIdentity(updatedUserAccount);
  },

  handleIdentityConfirmationSubmit() {
    this.hideAlerts();

    if (this.refs.identityConfirmationCode.value == undefined || this.refs.identityConfirmationCode.value < 1) {
      this.props.updateError({
        message: "Identity confirmation code must be supplied. Please find this in the email we've " +
        " sent to the supplied faculty identity."
      });
      this.props.showDangerAlert();
      return;
    }

    this.props.confirmIdentity(
      this.props.userAccount,
      Object.assign({}, this.props.userAccount, {
      identitySecret: this.refs.identityConfirmationCode.value
    }))
  },

  /**************************************************/

  componentDidMount() {
    this.hideAlerts();
    if (this.props.userAccount.facultyIdentity != undefined
      && this.props.userAccount.facultyIdentity.length > 0) {
      this.props.showIdentityConfirmationForm();
    }
  },

  render() {
    let that = this;

    return (
      <div className="container-fluid" style={{paddingLeft:"20%", paddingRight:"20%"}}>
        <ReactTooltip />
        <h3>
          Register Account
        </h3>
        <hr/>
        <div className="well well-lg">
          <p>
            {REGISTER_ACCOUNT}
          </p>
        </div>
        <hr/>

        <Alert type="danger" display={that.props.dangerAlert.display} onClick={e => this.props.hideDangerAlert()}
               content={[
          {payload: that.props.error.message}
        ]}/>

        {/* Identity registration form */}

        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label">User ID</label>
            <div className="col-sm-10">
              <input className="form-control" id="userIdDisabledInput"
                     type="text" defaultValue={this.props.userAccount.user} disabled/>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">Identity</label>
            <div className="col-sm-10">
              <input type="email" className="form-control"
                     ref="facultyIdentity" placeholder="Your assigned faculty identity"
                     defaultValue={this.props.userAccount.facultyIdentity}/>
            </div>
          </div>
          <div className="form-group">

            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-primary"
                      onClick={e => {e.preventDefault(); this.handleRegisterAccountSubmit()}}>
                Register Account
              </button>
              <Spinner stopped={this.props.spinner.stopped} config={{scale:0.5}}/>

              <span className="glyphicon glyphicon-info-sign" aria-hidden="true"
                    data-tip={EMAIL_CONFIRMATION} data-effect="solid" data-event="click" data-place="right"
                    style={{marginLeft:10, cursor:"pointer"}}/>
            </div>
          </div>
        </form>

        <Alert type="success" display={that.props.successAlert.display} content={[
          {payload: that.props.success.message}
        ]}/>

        {/* Identity confirmation form */}

        <form className="form-horizontal" style={{display: this.props.identityConfirmationForm.display}}>
          <hr />
          <div className="form-group">
            <label className="col-sm-2 control-label">Code</label>
            <div className="col-sm-10">
              <input className="form-control"
                     ref="identityConfirmationCode" placeholder="The confirmation code you received by email" />
            </div>
          </div>
          <div className="form-group">

            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-primary"
                      onClick={e => {e.preventDefault(); this.handleIdentityConfirmationSubmit()}}>
                Confirm Identity
              </button>
              <Spinner stopped={this.props.spinner.stopped} config={{scale:0.5}}/>

              <span className="glyphicon glyphicon-info-sign" aria-hidden="true"
                    data-tip={EMAIL_CONFIRMATION} data-effect="solid" data-event="click" data-place="right"
                    style={{marginLeft:10, cursor:"pointer"}}/>
            </div>
          </div>
        </form>
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
    userAccount: state.reducers.userAccount,
    error: state.reducers.error,
    success: state.reducers.success,
    spinner: state.reducers.spinner,
    identityConfirmationForm: state.reducers.identityConfirmationForm,
    dangerAlert: state.reducers.dangerAlert,
    successAlert: state.reducers.successAlert
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSuccessAlert: () => {
      dispatch(showSuccessAlert());
    },
    hideSuccessAlert: () => {
      dispatch(hideSuccessAlert());
    },
    showDangerAlert: () => {
      dispatch(showDangerAlert());
    },
    hideDangerAlert: () => {
      dispatch(hideDangerAlert());
    },
    updateError: (errorData) => {
      dispatch(updateError(errorData));
    },
    updateSuccess: (successData) => {
      dispatch(updateSuccess(successData));
    },
    registerIdentity: (accountData) => {
      dispatch(registerIdentity(accountData));
    },
    updateUserAccountData: (accountData) => {
      dispatch(updateUserAccountData(accountData));
    },
    confirmIdentity: (accountData, confirmIdentityPayload) => {
      dispatch(confirmIdentity(accountData, confirmIdentityPayload));
    },
    showIdentityConfirmationForm: () => {
      dispatch(showIdentityConfirmationForm());
    }
  }
};

RegisterAccount = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterAccount);

export default RegisterAccount
