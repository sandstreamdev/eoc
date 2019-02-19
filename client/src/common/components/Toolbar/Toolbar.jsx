import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { COMPANY_PAGE_URL } from 'common/constants/variables';
import CompanyLogo from 'assets/images/company_logo.png';
import { HomeIcon } from 'assets/images/icons';
import UserBar from './components/UserBar';
import AppLogo from 'common/components/AppLogo';
import { createShoppingList } from 'modules/shopping-list/model/actions';
import { createCohort } from 'modules/cohort/model/actions';
import { getCurrentUser } from 'modules/authorization/model/selectors';

const Toolbar = ({ children, isHomePage }) => (
  <div className="toolbar">
    <div className="wrapper toolbar__wrapper">
      <div className="toolbar__left">
        <div>
          <a
            className="toolbar__company-link"
            href={COMPANY_PAGE_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              alt="Company logo"
              className="toolbar__company-logo"
              src={CompanyLogo}
            />
          </a>
        </div>
        {!isHomePage && (
          <div className="toolbar__icon-wrapper">
            <Link className="toolbar__icon-link" to="/dashboard">
              <HomeIcon />
            </Link>
          </div>
        )}
        {children}
      </div>
      <div className="toolbar__logo">
        <AppLogo />
      </div>
      <div className="toolbar__right">
        <UserBar />
      </div>
    </div>
  </div>
);

Toolbar.propTypes = {
  children: PropTypes.node,
  isHomePage: PropTypes.bool
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { createCohort, createShoppingList }
)(Toolbar);
