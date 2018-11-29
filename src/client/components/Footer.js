import React from 'react';

import {
  SANDSTREAM_URL,
  PROJECT_NAME,
  COMPANY_NAME
} from '../common/variables';

const Footer = () => (
  <div className="footer">
    <span className="footer__text">{PROJECT_NAME}</span>
    <span className="footer__text">&copy; Copyrights 2018</span>
    <a className="footer__text" href={SANDSTREAM_URL}>
      {COMPANY_NAME}
    </a>
  </div>
);

export default Footer;
