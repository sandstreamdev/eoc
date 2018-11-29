import React from 'react';

import {
  COMPANY_NAME,
  COMPANY_PAGE_URL,
  PROJECT_NAME
} from '../common/variables';

const Footer = () => (
  <div className="footer">
    <span className="footer__text">{PROJECT_NAME}</span>
    <span className="footer__text">&copy; Copyrights 2018</span>
    <a
      className="footer__text"
      href={COMPANY_PAGE_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      {COMPANY_NAME}
    </a>
  </div>
);

export default Footer;
