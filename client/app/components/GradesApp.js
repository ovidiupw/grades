import { connect } from 'react-redux'
import React from 'react';
// import {someApiFetch} from '../actions/someApi';

var GradesApp = React.createClass ({
  render() {
    return <div>
      <p>Grades application workings!</p>
    </div>
  }
})

GradesApp = connect()(GradesApp)

export default GradesApp
