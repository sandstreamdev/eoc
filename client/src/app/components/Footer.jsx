import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { COMPANY_NAME, COMPANY_PAGE_URL } from 'common/constants/variables';
import './Footer.scss';

const Footer = () => (
  <div className="footer">
    <div className="wrapper footer__wrapper">
      <span className="footer__text">
        <Link className="footer__text footer__link" to="/about">
          <FormattedMessage id="app.footer.about" />
        </Link>
        <span className="footer__text-divider"> | </span>
        <Link className="footer__text footer__link" to="/privacy-policy">
          <FormattedMessage id="app.footer.privacy" />
        </Link>
        <span className="footer__text-divider"> | </span>
        <Link className="footer__text footer__link" to="/libraries">
          <FormattedMessage id="app.footer.libraries" />
        </Link>
      </span>
      <span className="footer__text footer__copyrights">
        <FormattedMessage id="app.footer.copyrights" />
      </span>
      <a
        className="footer__text footer__link"
        href={COMPANY_PAGE_URL}
        rel="noopener noreferrer"
        target="_blank"
      >
        {COMPANY_NAME}
      </a>
    </div>
  </div>
);

export default Footer;
