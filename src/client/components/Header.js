import React from 'react';

import AppIcon from '../assets/images/coffee-solid.svg';
import { COMPANY_PAGE_URL, PROJECT_NAME } from '../common/variables';
import CompanyLogo from '../assets/images/company_logo.png';

const Header = props => (
  <div className="app-header">
    <div className="app-header__logo">
      <span className="app-header__text">{PROJECT_NAME}</span>
      <img alt="Coffee icon" className="app-header__icon" src={AppIcon} />
    </div>
    <a
      className="app-header__link"
      href={COMPANY_PAGE_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img alt="Company logo" className="app-header__logo" src={CompanyLogo} />
    </a>
  </div>
);
export default Header;
