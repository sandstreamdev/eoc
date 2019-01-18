import React from 'react';

import { COMPANY_PAGE_URL } from 'common/constants/variables';
import CompanyLogo from 'assets/images/company_logo.png';
import HomeIcon from 'assets/images/home-solid.svg';
import UsersIcon from 'assets/images/users-solid.svg';
import ListIcon from 'assets/images/clipboard-list-solid.svg';
import PlusIcon from 'assets/images/plus-solid.svg';
import UserBar from 'modules/legacy/UserBar';

const Toolbar = () => (
  <div className="toolbar">
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
      <a className="toolbar__icon-wrapper" href="#!">
        <img
          alt="Home icon"
          className="toolbar__icon-home toolbar__icon"
          src={HomeIcon}
        />
      </a>
      <a className="toolbar__icon-wrapper" href="#!">
        <img
          alt="Home icon"
          className="toolbar__icon-cohort toolbar__icon"
          src={UsersIcon}
        />
        <img alt="Plus icon" className="toolbar__icon-plus" src={PlusIcon} />
      </a>
      <a className="toolbar__icon-wrapper" href="#!">
        <img
          alt="Home icon"
          className="toolbar__icon-list toolbar__icon"
          src={ListIcon}
        />
        <img alt="Plus Icon" className="toolbar__icon-plus" src={PlusIcon} />
      </a>
    </div>
    <div className="toolbar__right">
      <UserBar />
    </div>
  </div>
);

export default Toolbar;
