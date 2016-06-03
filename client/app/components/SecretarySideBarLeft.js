import React from 'react';
import {Link} from 'react-router';
import {
  SECRETARY_HOME,
  SECRETARY_STUDENTS
} from '../constants/routes';

let DeveloperSideBarLeft = React.createClass({

  render() {
    const ACTIVE = {background: '#337ab7', color: '#fff'};

    return (
      <div>
        <ul className="nav nav-pills nav-stacked">
          <li>
            <Link to={SECRETARY_HOME} activeStyle={ACTIVE}>Secretary Panel</Link>
          </li>
          <li role="presentation">
            <Link to={SECRETARY_STUDENTS} activeStyle={ACTIVE}>Students</Link>
          </li>
        </ul>


      </div>
    )
  }
});

export default DeveloperSideBarLeft;
