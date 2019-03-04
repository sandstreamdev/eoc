import React from 'react';

import AppLogo from 'common/components/AppLogo';
import { COMPANY_PAGE_URL, ENDPOINT_URL } from 'common/constants/variables';

const AuthBox = () => (
  <div className="authbox">
    <div className="authbox__left">
      <h2 className="authbox__heading">End Of Coffee</h2>
      <p className="authbox__description">
        The best app to track your office inventory.
      </p>
    </div>
    <div className="authbox__right">
      <div className="authbox__intro">
        <AppLogo />
        <span className="authbox__subheading">When the fridge is empty...</span>
      </div>
      <div className="authbox__buttons">
        <h1 className="authbox__sign-in">Sign in with:</h1>
        <a className="google-button" href={`${ENDPOINT_URL}/auth/google`}>
          <img
            alt="Google Icon"
            className="google-button__img"
            src="client/src/assets/images/google-btn.png"
          />
        </a>
      </div>
      <footer className="authbox__footer">
        <a className="authbox__link" href={COMPANY_PAGE_URL}>
          www.sandstream.pl
        </a>
      </footer>
    </div>
  </div>
);

export default AuthBox;
