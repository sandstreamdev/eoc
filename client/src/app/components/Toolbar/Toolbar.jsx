import React from 'react';
import { Link } from 'react-router-dom';

import { COMPANY_PAGE_URL } from 'common/constants/variables';
import CompanyLogo from 'assets/images/company_logo.png';
import HomeIcon from 'assets/images/home-solid';
import UsersIcon from 'assets/images/users-solid';
import ListIcon from 'assets/images/clipboard-list-solid';
import PlusIcon from 'assets/images/plus-solid.svg';
import UserBar from './components/UserBar';
import AppLogo from 'common/components/AppLogo';

const Toolbar = () => (
  <div className="toolbar">
    <div className="wrapper toolbar__wrapper">
      <div className="toolbar__left">
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
        <Link className="toolbar__icon-wrapper" to="/dashboard">
          <HomeIcon />
        </Link>
        <a className="toolbar__icon-wrapper" href="#!">
          <UsersIcon />
          <img alt="Plus icon" className="toolbar__icon-plus" src={PlusIcon} />
        </a>
        <a className="toolbar__icon-wrapper" href="#!">
          <ListIcon />
          <img alt="Plus Icon" className="toolbar__icon-plus" src={PlusIcon} />
        </a>
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

export default Toolbar;
