import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import Utility from '../modules/utility';
import {REGISTRATIONS_COLUMNS, REGISTRATIONS_COLUMN_NAMES} from '../constants/tables';
import TableHeader from '../components-utility/TableHeader'
import TableRow from '../components-utility/TableRow'
import AddRegistrationForm from '../components/AddRegistrationForm'
import Spinner from 'react-spin'
import Alert from '../components-utility/Alert'

import {
  showAddRegistrationForm,
  hideAddRegistrationForm,
  showDangerAlert,
  hideDangerAlert,
} from '../actions/actions';

import {
  fetchRegistrations
} from '../actions/thunks';

let Registrations = React.createClass({

  toggleAddRegistrationForm() {
    if (this.props.addRegistrationForm.display === "none") {
      this.props.showAddRegistrationForm();
    } else {
      this.props.hideAddRegistrationForm();
    }
  },

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    Utility.redirectOnSessionProblem(this.props.userAccount, this.context.router);
    this.props.fetchRegistrations(this.props.userAccount);
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
            <a href="#" style={{cursor:"pointer", color:"#337ab7"}} onClick={e => this.toggleAddRegistrationForm()}>
              Configure a new registration
            </a>
          </li>
          <li role="presentation">
            <div style={{marginLeft:40, marginTop:18}}>
              <Spinner stopped={this.props.spinner.stopped} config={{scale:0.5,  top:"100%",  left:"50%"}}/>
            </div>
          </li>
        </ul>
        <AddRegistrationForm style={{marginTop:20}}/>

        <table className="table table-striped" style={{marginTop:20}}>
          <thead>
          <TableHeader columns={REGISTRATIONS_COLUMNS} columnNames={REGISTRATIONS_COLUMN_NAMES}/>
          </thead>
          <tbody>
          {this.props.registrations.items.map((registration, i) => {
            return <TableRow key={i} columns={REGISTRATIONS_COLUMNS} columnData={registration}/>
          })}
          </tbody>
        </table>
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
    userAccount: state.reducers.userAccount,
    registrations: state.reducers.registrations,
    addRegistrationForm: state.reducers.addRegistrationForm,
    spinner: state.reducers.spinner,
    dangerAlert: state.reducers.dangerAlert,
    error: state.reducers.error,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRegistrations: (userAccount) => {
      dispatch(fetchRegistrations(userAccount));
    },
    showAddRegistrationForm: () => {
      dispatch(showAddRegistrationForm());
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
  }
};

Registrations = connect(
  mapStateToProps,
  mapDispatchToProps
)(Registrations);

export default Registrations;
