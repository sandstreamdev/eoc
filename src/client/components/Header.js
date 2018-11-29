import React from 'react';

import {
  SANDSTREAM_URL,
  PROJECT_NAME,
  COMPANY_NAME
} from '../common/variables';
import AppIcon from '../assets/images/coffee-solid.svg';

function Header(props) {
  return (
    <div className="app-header">
      <div className="app-header__logo">
        <span className="app-header__text">{PROJECT_NAME}</span>
        <img className="app-header__icon" src={AppIcon} alt="Coffee icon" />
      </div>
      <a href={SANDSTREAM_URL} className="app-header__link">
        {COMPANY_NAME}
      </a>
    </div>
  );
}
export default Header;
