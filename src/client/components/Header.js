import React from 'react';

import AppLogo from './AppLogo';
import { COMPANY_PAGE_URL } from '../common/variables';
import SandstreamLogo from '../assets/images/sandstream_logo.png';

const Header = props => (
  <div className="app-header">
    <AppLogo />
    <a
      className="app-header__link"
      href={COMPANY_PAGE_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        alt="Sandstream logo"
        className="app-header__logo"
        src={SandstreamLogo}
      />
    </a>
  </div>
);
export default Header;
