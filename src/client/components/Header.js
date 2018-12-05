import React from 'react';

import AppIcon from '../assets/images/coffee-solid.svg';
import {
  COMPANY_NAME,
  COMPANY_PAGE_URL,
  PROJECT_NAME
} from '../common/variables';

const Header = props => (
  <div className="app-header">
    <div className="app-header__logo">
      <span className="app-header__text">{PROJECT_NAME}</span>
      <img className="app-header__icon" src={AppIcon} alt="Coffee icon" />
    </div>
    <a
      className="app-header__link"
      href={COMPANY_PAGE_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      {COMPANY_NAME}
    </a>
  </div>
);
export default Header;
