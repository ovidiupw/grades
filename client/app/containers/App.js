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
        {this.props.children}
      </div>
    )}
});

export default App;
