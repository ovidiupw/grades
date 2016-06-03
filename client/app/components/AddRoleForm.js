import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import Utility from '../modules/utility'
import Action from '../components-utility/Action';

import {
  fetchApiResources,
  addRole
} from '../actions/thunks';

import {
  updateRoleFormTitle,
  showSuccessAlert,
  hideSuccessAlert,
  showDangerAlert,
  hideDangerAlert,
  updateError,
  removeRoleFormAction,
  addRoleFormAction
} from '../actions/actions';

let AddRoleForm = React.createClass({

  handleRoleSubmit() {
    this.props.hideDangerAlert();
    this.props.hideSuccessAlert();

    const roleTitle = this.refs.title.value;
    if (roleTitle == undefined || roleTitle.length < 1) {
      this.props.updateError({
        message: "You need to specify the role title (at least 1 character)."
      });
      this.props.showDangerAlert();
      return;
    }

    const roleTitleIndex = this.props.roles.findIndex(role => role.title === roleTitle);
    if (roleTitleIndex !== -1) {
      this.props.updateError({
        message: "The role title you specified already exists. Please choose another name for the new role."
      });
      this.props.showDangerAlert();
      return;
    }

    this.props.addRole(this.props.addRoleForm, this.props.userAccount);
  },
  
  handleActionRemove(action) {
    this.props.removeRoleFormAction(action);
  },

  handleActionAdd() {
    let existingActions = this.props.addRoleForm.actions;
    let newAction = {
      verb: this.refs.verb.value,
      resource: this.refs.resource.value
    };
    let newActionIndex = existingActions.findIndex(
      action => action.verb === newAction.verb && action.resource === newAction.resource);
    if (newActionIndex !== -1) {
      this.props.updateError({
        message: "You have already specified and added the current action to the permissions list."
      });
      this.props.showDangerAlert();
      return;
    }

    this.props.addRoleFormAction(newAction)
  },

  handleTitleChanged() {
    this.props.updateRoleFormTitle(this.refs.title.value);
  },

  /*****************************************/

  componentDidMount() {
    this.props.fetchApiResources(this.props.userAccount);
  },

  componentWillReceiveProps() {
    Utility.persistAddRoleForm(this.props.addRoleForm);
  },

  componentDidUpdate() {
    Utility.persistAddRoleForm(this.props.addRoleForm);
  },

  render() {
    let style = Object.assign({}, this.props.style, {
      display: this.props.addRoleForm.display
    });

    return (
      <div className="well" style={style}>
        <form className="form-horizontal">

          <div className="form-group">
            <label className="col-sm-2 control-label">Title</label>
            <div className="col-sm-10 input-group">
              <input className="form-control" type="text"
                     ref="title" placeholder="The title of the new role"
                     onChange={e => this.handleTitleChanged()}
                     value={this.props.addRoleForm.title}/>
              <span className="input-group-addon"></span>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">Verb</label>
            <div className="col-sm-4 input-group">
              <select className="form-control" ref="verb">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>PATCH</option>
              </select>
            </div>
          </div>

          <div className="form-group form-inline">
            <label className="col-sm-2 control-label">Resource</label>
            <div className="col-sm-4 input-group" style={{marginRight:15, marginBottom:5}}>
              <select className="form-control" ref="resource">
                {this.props.apiResources.items.map((resource, key) => <option key={key}>{resource}</option>)}
              </select>
            </div>
            <div className="col-sm-4 input-group">
              <button type="submit" className="btn btn-default"
                      onClick={e => {e.preventDefault(); this.handleActionAdd()}}>
                Add Permission
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label"></label>
            <div className="col-sm-10"
                 style={{marginTop:5, borderBottom: "1px solid #eee", padding: 0, paddingBottom:15}}>
              <div style={{lineHeight:2}}>
                {this.props.addRoleForm.actions.map(action => 
                  <Action action={action} deleteHandler={e => this.handleActionRemove(action)} />
                  )}
              </div>
            </div>
          </div>


          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10 input-group">
              <button type="submit" className="btn btn-primary"
                      onClick={e => {e.preventDefault(); this.handleRoleSubmit()}}>
                Create Role
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
    addRoleForm: state.reducers.addRoleForm,
    roles: state.reducers.roles.items,
    userAccount: state.reducers.userAccount,
    apiResources: state.reducers.apiResources
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addRole: (role, userAccount) => {
      dispatch(addRole(role, userAccount));
    },
    removeRoleFormAction: (action) => {
      dispatch(removeRoleFormAction(action));
    },
    addRoleFormAction: (action) => {
      dispatch(addRoleFormAction(action));
    },
    updateError: (errorData) => {
      dispatch(updateError(errorData));
    },
    updateRoleFormTitle: (title) => {
      dispatch(updateRoleFormTitle(title));
    },
    fetchApiResources: (userAccount) => {
      dispatch(fetchApiResources(userAccount));
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
    }
  }
};

AddRoleForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRoleForm);

export default AddRoleForm;
