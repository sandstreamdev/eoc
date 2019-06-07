import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { COMPANY_NAME, COMPANY_PAGE_URL } from 'common/constants/variables';

const Footer = () => (
  <div className="footer">
    <div className="wrapper footer__wrapper">
      <span className="footer__text">
        <Link className="footer__text footer__link" to="/about">
          <FormattedMessage defaultMessage="About" id="footer.about" />
        </Link>
        <span className="footer__text-divider"> | </span>
        <Link className="footer__text footer__link" to="/privacy-policy">
          <FormattedMessage
            defaultMessage="Privacy & Terms"
            id="footer.privacy"
          />
        </Link>
      </span>
      <span className="footer__text footer__copyrights">
        &copy;
        <FormattedMessage
          defaultMessage="Copyrights 2019"
          id="footer.copyrights"
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
