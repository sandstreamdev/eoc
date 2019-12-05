import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import HomeLink from 'common/components/HomeLink';
import { COMPANY_PAGE_URL, COMPANY_WEBSITE } from 'common/constants/variables';
import './AuthLayout.scss';

const AuthLayout = ({ children }) => (
  <div className="auth-layout">
    <div className="auth-layout__left">
      <h2 className="auth-layout__heading">
        <FormattedMessage id="common.app-name" />
      </h2>
      <p className="auth-layout__description">
        <FormattedMessage id="user.auth-box.description" />
      </p>
    </div>
    <div className="auth-layout__right">
      <div className="auth-layout__intro">
        <HomeLink />
      </div>
      {children}
      <footer className="auth-layout__footer">
        <a
          className="auth-layout__link"
          href={COMPANY_PAGE_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          {COMPANY_WEBSITE}
        </a>
      </footer>
    </div>
  </div>
);

AuthLayout.propTypes = {
  children: PropTypes.any
};

export default AuthLayout;
