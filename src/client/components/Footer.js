import React from 'react';

import { sandstreamUrl, projectName } from '../common/variables';

const Footer = () => (
  <div className="footer">
    <span className="footer__text">{projectName}</span>
    <span className="footer__text">&copy; Copyrights 2018</span>
    <a className="footer__text" href={sandstreamUrl}>
      Sandstream Development
    </a>
  </div>
);

export default Footer;
