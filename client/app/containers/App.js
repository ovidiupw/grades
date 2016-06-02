import React from 'react';

import NavBarTop from '../components/NavBarTop';
/**
 Creates a container for the application's components.
 */
let App = React.createClass({
  render() {
    return (
      <div>
        <NavBarTop />

        {/* Now add the passed prop content */}
        <div className="container-fluid">
          {this.props.children}
        </div>

      </div>
    )
  }
});

export default App;
