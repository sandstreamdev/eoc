import React from 'react';

import { sandstreamUrl, projectName } from '../common/variables';

function Header(props) {
  return (
    <div className="app-header">
      <div className="app-header__logo">
        <span className="app-header__text">{projectName}</span>

        <img
          className="app-header__icon"
          src="src/client/assets/images/coffee-solid.svg"
          alt="Cofee icon"
        />
      </div>

      <a href={sandstreamUrl} className="app-header__link">
        Sandstream Development
      </a>
    </div>
  );
}

export default Header;
