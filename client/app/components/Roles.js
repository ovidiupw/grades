import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import Utility from '../modules/utility';
import {ROLES_COLUMNS, ROLES_COLUMN_NAMES} from '../constants/tables';
import TableHeader from '../components-utility/TableHeader'
import TableRow from '../components-utility/TableRow'
import AddRoleForm from '../components/AddRoleForm'
import Spinner from 'react-spin'
import Alert from '../components-utility/Alert'

import {
  showAddRoleForm,
  hideAddRoleForm,
  showDangerAlert,
  hideDangerAlert,
  showSuccessAlert,
  hideSuccessAlert
} from '../actions/actions';

import {
  fetchRoles
} from '../actions/thunks';

let Roles = React.createClass({

  toggleAddRoleForm() {
    if (this.props.addRoleForm.display === "none") {
      this.props.showAddRoleForm();
    } else {
      this.props.hideAddRoleForm();
    }
  },

  /************************************/

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    Utility.redirectOnSessionProblem(this.props.userAccount, this.context.router);
    this.props.fetchRoles(this.props.userAccount);
  },

  render() {
    return (
      <div>
        <Alert type="danger" display={this.props.dangerAlert.display} onClick={e => this.props.hideDangerAlert()}
               content={[
          {payload: this.props.error.message}
        ]}/>
        <ul className="nav nav-tabs">
          <li role="presentation" className="active">
            <a href="#" style={{cursor:"pointer", color:"#337ab7"}} onClick={e => this.toggleAddRoleForm()}>
              Configure a new role
            </a>
          </li>
          <li role="presentation">
            <div style={{marginLeft:40, marginTop:18}}>
              <Spinner stopped={this.props.spinner.stopped} config={{scale:0.5,  top:"100%",  left:"50%"}}/>
            </div>
          </li>
        </ul>
        <AddRoleForm style={{marginTop:20}}/>

        <br/>
        <Alert type="success" display={this.props.successAlert.display} onClick={e => this.props.hideSuccessAlert()}
               content={[
          {payload: this.props.success.message},
          {payload: <br/>},
          {payload: this.props.success.data}
        ]}/>

        <div className="table-responsive">
          <table className="table table-striped" style={{marginTop:20}}>
            <thead>
            <TableHeader style={{textAlign:"left"}}
                         columns={ROLES_COLUMNS} columnNames={ROLES_COLUMN_NAMES}/>
            </thead>
            <tbody style={{textAlign:"left"}}>
            {this.props.roles.items.map((role, i) => {
              return <TableRow key={i}
                               columns={ROLES_COLUMNS} columnData={role}
                               actionsFormatter={Utility.getFormattedActions}
                               actionsFormatterColumnName="actions"/>
            })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
    userAccount: state.reducers.userAccount,
    roles: state.reducers.roles,
    addRoleForm: state.reducers.addRoleForm,
    spinner: state.reducers.spinner,
    dangerAlert: state.reducers.dangerAlert,
    error: state.reducers.error,
    success: state.reducers.success,
    successAlert: state.reducers.successAlert
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRoles: (userAccount) => {
      dispatch(fetchRoles(userAccount));
    },
    showAddRoleForm: () => {
      dispatch(showAddRoleForm());
    },
    hideAddRoleForm: () => {
      dispatch(hideAddRoleForm());
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

Roles = connect(
  mapStateToProps,
  mapDispatchToProps
)(Roles);

export default Roles;
