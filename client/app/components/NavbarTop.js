import { connect } from 'react-redux'
import React from 'react'

let NavbarTop = React.createClass ({
  render() {
    return (
    <div>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              <p>TodoApp</p>
            </a>
          </div>
        </div>
      </nav>
    </div>
  )}
})

NavbarTop = connect()(NavbarTop)

export default NavbarTop
