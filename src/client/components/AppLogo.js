import React from 'react';

import AppIcon from '../assets/images/coffee-solid.svg';
import { PROJECT_NAME } from '../common/variables';

const AppLogo = () => (
  <div className="app-logo">
    <span className="app-logo__text">{PROJECT_NAME}</span>
    <img className="app-logo__icon" src={AppIcon} alt="Coffee icon" />
  </div>
);

export default AppLogo;
