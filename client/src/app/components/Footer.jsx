import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { COMPANY_NAME, COMPANY_PAGE_URL } from 'common/constants/variables';

const Footer = () => (
  <div className="footer">
    <div className="wrapper footer__wrapper">
      <span className="footer__text">
        <Link className="footer__text footer__link" to="/about">
          <FormattedMessage id="footer.about" defaultMessage="About" />
        </Link>
        <span className="footer__text-divider"> | </span>
        <Link className="footer__text footer__link" to="/privacy-policy">
          <FormattedMessage
            id="footer.privacy"
            defaultMessage="Privacy & Terms"
          />
        </Link>
      </span>
      <span className="footer__text footer__copyrights">
        &copy;
        <FormattedMessage
          id="footer.copyrights"
          defaultMessage="Copyrights 2019"
        />
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
