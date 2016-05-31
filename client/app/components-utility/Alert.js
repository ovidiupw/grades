import { connect } from 'react-redux'
import React, { PropTypes } from 'react';

import {
  makeAlertInvisible,
} from '../actions/actions';


let Alert = React.createClass({

  getCssClassBasedOnTypeOfAlert(typeOfAlert) {
    const defaultClasses = 'alert alert-dismissible';

    switch (typeOfAlert) {
      case 'success': return defaultClasses + ' alert-success';
      case 'info': return defaultClasses + ' alert-info';
      case 'warning': return defaultClasses + ' alert-warning';
      case 'danger': return defaultClasses + ' alert-danger';
      default:
        throw 'The alert type you specified was invalid.';
    }
  },

  render() {
    let alertCssClass = this.getCssClassBasedOnTypeOfAlert(this.props.type);
    let alertStyle = {
      display: this.props.display,
      textAlign: 'center'
    };

    return (
      <div className={alertCssClass} role="alert" style={alertStyle}>
        <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                onClick={this.props.onClick}>
          <span aria-hidden="true">
            &times;
          </span>
        </button>
        {this.props.content.map(element => element.payload)}
      </div>
    )
  }
});

const mapStateToProps = (state) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    makeAlertInvisible: () => {
      dispatch(makeAlertInvisible());
    }
  }
};

Alert = connect(
  mapStateToProps,
  mapDispatchToProps
)(Alert);

export default Alert;
