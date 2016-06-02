import {connect} from 'react-redux';
import React, {PropTypes} from 'react';
import ReactTooltip from 'react-tooltip';
import Utility from '../modules/utility';

let RoleBox = React.createClass({

  contextTypes: {
    role: React.PropTypes.object,
    onRemove: React.PropTypes.func
  },

  style: {
    marginLeft: 5,
    marginTop: 5,
    borderRadius: 4,
    backgroundColor: "white",
    padding: 7
  },

  render() {
    return (
      <div style={this.style}>
        {this.props.role.title}
        <span className="glyphicon glyphicon-info-sign" aria-hidden=" true" style={{marginLeft:12}}
              data-html={true}
              data-tip={Utility.getHtmlRoleDescription(this.props.role)}
              data-effect="solid"
              data-event="click">
        </span>
        <button type="button" className="btn btn-xs" aria-label="Left Align" style={{marginLeft:12}}
                onClick={e => this.props.onRemove(this.props.role)}>
          <span className="glyphicon glyphicon-remove" aria-hidden=" true"></span>
        </button>

        <ReactTooltip />
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

RoleBox = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoleBox);

export default RoleBox
