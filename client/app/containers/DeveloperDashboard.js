import React from 'react';
import DeveloperSideBarLeft from '../components/DeveloperSideBarLeft';

let DeveloperDashboard = React.createClass({
  render() {
    return (
      <div className="row">
        <div className="col-md-2 col-sm-3">
          <DeveloperSideBarLeft />
          <hr/>
        </div>
        <div className="col-md-10 col-sm-9">
          {this.props.children}
        </div>
      </div>

    )
  }
});

export default DeveloperDashboard;
