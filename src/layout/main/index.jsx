import React from 'react';
import { withRouter } from 'react-router-dom';

import './style.scss';

function Main({ children }) {
  return (
    <div id="main">
      <div id="mainContent">
        {children}
      </div>
    </div>
  );
}

export default withRouter(Main);
