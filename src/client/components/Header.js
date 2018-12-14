import React from 'react';

import AppLogo from './AppLogo';
import { COMPANY_NAME, COMPANY_PAGE_URL } from '../common/variables';

const Header = props => (
  <div className="app-header">
    <AppLogo />
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
