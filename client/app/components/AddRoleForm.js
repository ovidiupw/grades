import {connect} from 'react-redux'
import React, {PropTypes} from 'react';
import Utility from '../modules/utility'

import {
  updateRoleFormTitle
} from '../actions/actions';

let AddRoleForm = React.createClass({

  handleTitleChanged() {
    this.props.updateRoleFormTitle(this.refs.title.value);
  },

  /*****************************************/

  componentWillReceiveProps() {
    Utility.persistAddRoleForm(this.props.addRoleForm);
  },

  componentDidUpdate() {
    Utility.persistAddRoleForm(this.props.addRoleForm);
  },

  render() {
    let style = Object.assign(this.props.style, {
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
        </form>
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
    addRoleForm: state.reducers.addRoleForm,
    roles: state.reducers.roles.items,
    userAccount: state.reducers.userAccount
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateRoleFormTitle : (title) => {
      dispatch(updateRoleFormTitle(title));
    }
  }
};

AddRoleForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRoleForm);

export default AddRoleForm;
