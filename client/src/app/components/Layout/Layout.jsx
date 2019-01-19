import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Toolbar from '../Toolbar/Toolbar';

const Layout = ({ children }) => (
  <Fragment>
    <Toolbar />
    {children}
  </Fragment>
);

export default Layout;

Layout.propTypes = {
  children: PropTypes.node
};
