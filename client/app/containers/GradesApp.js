import { connect } from 'react-redux'
import React from 'react';
// import {someApiFetch} from '../actions/someApi';
import NavbarTop from '../components/NavbarTop'

/**
  Creates a container for the application's components.
*/
let GradesApp = React.createClass ({
  render() {
    return (
    <div>
      <NavbarTop />
    </div>
  )}
})

GradesApp = connect()(GradesApp)

export default GradesApp
