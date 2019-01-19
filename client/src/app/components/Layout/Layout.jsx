import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Toolbar from '../Toolbar/Toolbar';

const Layout = ({ children }) => (
  <Fragment>
    <Toolbar />
    <div>
      <NavLink to="/dashboard">Dashboard </NavLink>
      <NavLink to="/cohort/fghdfhg567">Cohort </NavLink>
      <NavLink to="/list/asd224">List </NavLink>
    </div>
    {children}
  </Fragment>
);

export default Layout;

Layout.propTypes = {
  children: PropTypes.node
};
