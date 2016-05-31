import { connect } from 'react-redux'
import { Link } from 'react-router'
import React from 'react'

let NavBarTop = React.createClass ({
  render() {
    return (
    <div>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link className="navbar-brand" to={'/home'}>
              <p>Grades</p>
            </Link>
          </div>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="http://students.info.uaic.ro/~ovidiu.pricop/index.html"
                target="_blank">
                Help
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )}
});

NavBarTop = connect()(NavBarTop);

export default NavBarTop;
