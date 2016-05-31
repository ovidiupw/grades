import React from 'react';

import DeveloperSideBarLeft from '../components/DeveloperSideBarLeft';

let Dashboard = React.createClass({
  render() {
    return (
      <div>
        <DeveloperSideBarLeft />
        {/* Now add the passed prop content */}
        {this.props.children}
      </div>
    )}
});

export default Dashboard;
