import React from 'react';

import { PROJECT_NAME } from '../constants/variables';
import { AppIcon } from 'assets/images/icons';

const AppLogo = () => (
  <div className="app-logo">
    <span className="app-logo__text">{PROJECT_NAME}</span>
    <span className="app-logo__icon">
      <AppIcon />
    </span>
  </div>
);

export default AppLogo;
