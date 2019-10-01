import React from 'react';
import { Link } from 'react-router-dom';

import AppLogo from 'common/components/AppLogo';
import './HomeLink.scss';

const HomeLink = () => (
  <Link className="home-link" to="/">
    <AppLogo />
  </Link>
);

export default HomeLink;
