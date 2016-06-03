import {connect} from 'react-redux'
import React, {PropTypes} from 'react';

let Action = React.createClass({

  getVerbColor(verb) {
    switch (verb.toUpperCase()) {
      case "POST":
        return "#13c20f";
      case "GET":
        return "#2392f7";
      case "PUT":
        return "#ff9000";
      case "DELETE":
        return "#e30012";
      case "PATCH":
        return "#af01d9";

      default:
        return "black";
    }
  },

  deleteButtonDisplay: "none",

  /****************************/

  contextTypes: {
    action: React.PropTypes.object
  },

  render() {

    if (this.props.deleteHandler != undefined) {
      this.deleteButtonDisplay = "inline-block";
    }

    let style = {
      color: "white",
        borderRadius: 4,
        marginTop: 5,
        marginRight: 5,
        overflowWrap: "break-word",
        display: "inline-block",
        paddingBottom: 3,
        paddingTop: 3,
        paddingLeft: 10,
        paddingRight: 10
    };
 
    let verbColor = this.getVerbColor(this.props.action.verb);

    return (
      <span style={Object.assign(style, {
          backgroundColor: verbColor
        })}>
        <strong>
        {this.props.action.verb.toUpperCase()}
        </strong>

        <span style={{marginLeft:10, marginRight:5}}>
        {this.props.action.resource}
        </span>

        <span className="glyphicon glyphicon-remove" onClick={this.props.deleteHandler} aria-hidden="true"
              style={{display: this.deleteButtonDisplay, cursor: "pointer", marginLeft:10}}>
        </span>
      </span>

    )
  }
});

const mapStateToProps = (state) => {
  return {}
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

Action = connect(
  mapStateToProps,
  mapDispatchToProps
)(Action);

export default Action;
