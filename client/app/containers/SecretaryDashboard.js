import React from 'react';
import SecretarySideBarLeft from '../components/SecretarySideBarLeft';

let SecretaryDashboard = React.createClass({
  render() {
    return (
      <div className="row">
        <div className="col-md-2 col-sm-3">
          <SecretarySideBarLeft />
          <hr/>
        </div>
        <div className="col-md-10 col-sm-9">
          {this.props.children}
        </div>
      </div>

    )
  }
});

export default SecretaryDashboard;
