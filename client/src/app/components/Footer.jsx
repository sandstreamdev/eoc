import React from 'react';

import {
  COMPANY_NAME,
  COMPANY_PAGE_URL,
  PROJECT_NAME
} from 'common/constants/variables';

const Footer = () => (
  <div className="footer">
    <div className="wrapper footer__wrapper">
      <span className="footer__text">{PROJECT_NAME}</span>
      <span className="footer__text">&copy; Copyrights 2019</span>
      <a
        className="footer__text"
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
