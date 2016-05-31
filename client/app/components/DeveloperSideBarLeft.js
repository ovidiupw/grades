import React from 'react';
import {Link} from 'react-router';
import {
  DEVELOPER_HOME,
  DEVELOPER_REGISTRATIONS,
  DEVELOPER_ROLES
} from '../constants/routes';

let DeveloperSideBarLeft = React.createClass({


  componentDidMount() {
    let currentPathName
  },

  render() {
    const ACTIVE = { background: '#337ab7', color: '#fff'};

    return (
      <div>
        <div className="col-md-2 col-sm-3">
          <ul className="nav nav-pills nav-stacked">
            <li>
              <Link to={DEVELOPER_HOME} activeStyle={ACTIVE}>Developer Panel</Link>
            </li>
            <li role="presentation">
              <Link to={DEVELOPER_REGISTRATIONS} activeStyle={ACTIVE}>Registrations</Link>
            </li>
            <li role="presentation">
              <Link to={DEVELOPER_ROLES} activeStyle={ACTIVE}>Roles</Link>
            </li>
          </ul>
        </div>
        <div className="col-md-10 col-sm-9">
          {this.props.children}
        </div>

      </div>
    )
  }
});

export default DeveloperSideBarLeft;
