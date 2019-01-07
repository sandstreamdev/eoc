import React from 'react';

import AppLogo from './AppLogo';
import { ENDPOINT_URL } from '../common/variables';

const AuthBox = () => (
  <div className="authbox">
    <div className="authbox__intro">
      <AppLogo />
      <span className="authbox__subheading">When the fridge is empty...</span>
    </div>
    <div className="authbox__buttons">
      <h1 className="authbox__heading">Sign in:</h1>
      <a className="google-button" href={`${ENDPOINT_URL}/auth/google`}>
        <img
          alt="Google Icon"
          className="google-button__img"
          src="src/client/assets/images/google-btn.png"
        />
      </a>
    </div>
  </div>
);

export default AuthBox;
