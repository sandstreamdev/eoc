import React from 'react';

import AppIcon from 'assets/images/coffee-solid.svg';
import { PROJECT_NAME } from 'common/constants/variables';

const AppLogo = () => (
  <div className="app-logo">
    <span className="app-logo__text">{PROJECT_NAME}</span>
    <img alt="Coffee icon" className="app-logo__icon" src={AppIcon} />
  </div>
);

export default AppLogo;
