import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import RoleBox from '../components-utility/RoleBox'
import Utility from '../modules/utility'

import {
  hideAddRegistrationForm,
  showDangerAlert,
  hideDangerAlert,
  updateError,
  addRegistrationFormRole,
  removeRegistrationFormRole,
  updateRegistrationFormFacultyIdentity,
  updateRegistrationFormFacultyStatuses,
  showSuccessAlert,
  hideSuccessAlert
} from '../actions/actions';

import {
  fetchRoles,
  addRegistration
} from '../actions/thunks';

let AddRegistrationForm = React.createClass({

  handleRegistrationSubmit() {
    this.props.hideDangerAlert();
    this.props.hideSuccessAlert();
    this.props.addRegistration({
      roles: this.props.addRegistrationForm.roles.map(role => role.title),
      facultyIdentity: this.props.addRegistrationForm.facultyIdentity,
      facultyStatus: this.props.addRegistrationForm.facultyStatuses,

      apiKey: this.props.userAccount.apiKey,
      user: this.props.userAccount.user
    }, this.props.userAccount);
  },

  handleAddRole() {
    const roleTitle = this.refs.role.value;
    this.props.hideDangerAlert();
    this.props.hideSuccessAlert();

    if (roleTitle == undefined || roleTitle.length < 1) {
      this.props.updateError({
        message: "You need to specify the role name (at least 1 character)."
      });
      this.props.showDangerAlert();
      return;
    }

    let roleIndex = this.props.roles.findIndex(role => role.title === roleTitle);
    if (roleIndex === -1) {
      this.props.updateError({
        message: "The role you specified is not yet configured. You can configure a new role by going to 'Roles'" +
          ", in the left sidebar."
      });
      this.props.showDangerAlert();
      return;
    }

    let registrationFormRoleIndex = this.props.addRegistrationForm.roles.findIndex(role => role.title === roleTitle);
    if (registrationFormRoleIndex !== -1) {
      this.props.updateError({
        message: "The role you are trying to add has already been added to the list of roles."
      });
      this.props.showDangerAlert();
      return;
    }

    this.props.addRegistrationFormRole(this.props.roles[roleIndex]);

  },

  handleRemoveRole(roleToRemove) {
    this.props.removeRegistrationFormRole(roleToRemove);
  },

  handleFacultyIdentityChanged() {
    this.props.updateRegistrationFormFacultyIdentity(this.refs.facultyIdentity.value);
  },

  handleFacultyStatusesChanged() {
    this.props.updateRegistrationFormFacultyStatuses(this.refs.facultyStatuses.value
      .split(',')
      .filter(status => status.trim().length !== 0)
      .map(status => status.trim()));
  },

  /**********************************/
  
  componentDidMount() {
    this.props.fetchRoles(this.props.userAccount);
  },

  componentWillReceiveProps() {
    Utility.persistAddRegistrationForm(this.props.addRegistrationForm);
  },

  componentDidUpdate() {
    Utility.persistAddRegistrationForm(this.props.addRegistrationForm);
  },

  render() {
    let style = Object.assign(this.props.style, {
      display: this.props.addRegistrationForm.display
    });

    let persistedFacultyStatuses = this.props.addRegistrationForm.facultyStatuses;
    if (persistedFacultyStatuses != undefined) {
      persistedFacultyStatuses = persistedFacultyStatuses.map(status => status).toString();
    }

    return (
      <div className="well" style={style}>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label">Identity</label>
            <div className="col-sm-10 input-group">
              <input className="form-control" type="text"
                     ref="facultyIdentity" placeholder="The faculty identity of the new registration"
                     onChange={e => this.handleFacultyIdentityChanged()}
                     value={this.props.addRegistrationForm.facultyIdentity}/>
              <span className="input-group-addon"></span>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Roles</label>
            <div className="col-sm-10 input-group">
               <span className="input-group-addon" style={{paddingTop:0, paddingBottom:0}}>
                <button type="button" className="btn btn-default btn-xs"
                        onClick={e => this.handleAddRole()}>
                  <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                </button>
              </span>
              <input className="form-control"
                     ref="role"
                     placeholder="Type the name of the role and click '+'"/>
              <span className="input-group-addon"></span>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label"></label>
            <div className="col-sm-10 input-group">
              {this.props.addRegistrationForm.roles.map((role, i) => {
                return <RoleBox key={i} role={role} onRemove={this.handleRemoveRole}/>
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Statuses</label>
            <div className="col-sm-10 input-group">
              <input className="form-control"
                     ref="facultyStatuses"
                     placeholder="Comma separated list of faculty statuses"
                     onBlur={e => this.handleFacultyStatusesChanged()}
                     defaultValue={persistedFacultyStatuses}/>
              <span className="input-group-addon"></span>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10 input-group">
              <button type="submit" className="btn btn-primary"
                      onClick={e => {e.preventDefault(); this.handleRegistrationSubmit()}}>
                Submit Registration
              </button>
            </div>
          </div>

        </form>
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
    addRegistrationForm: state.reducers.addRegistrationForm,
    roles: state.reducers.roles.items,
    userAccount: state.reducers.userAccount
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addRegistration: (registration, userAccount) => {
      dispatch(addRegistration(registration, userAccount))
    },
    hideAddRegistrationForm: () => {
      dispatch(hideAddRegistrationForm());
    },
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
    updateError: (errorData) => {
      dispatch(updateError(errorData));
    },
    fetchRoles: (userAccount) => {
      dispatch(fetchRoles(userAccount));
    },
    addRegistrationFormRole: (role) => {
      dispatch(addRegistrationFormRole(role))
    },
    removeRegistrationFormRole: (role) => {
      dispatch(removeRegistrationFormRole(role));
    },
    updateRegistrationFormFacultyIdentity: (facultyIdentity) => {
      dispatch(updateRegistrationFormFacultyIdentity(facultyIdentity));
    },
    updateRegistrationFormFacultyStatuses: (facultyStatuses) => {
      dispatch(updateRegistrationFormFacultyStatuses(facultyStatuses));
    }
  }
};

AddRegistrationForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRegistrationForm);

export default AddRegistrationForm;
