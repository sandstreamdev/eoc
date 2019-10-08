import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { LogoutIcon, UserIcon, CohortIcon } from 'assets/images/icons';
import './UserBarMenu.scss';

const UserBarMenu = ({ avatar, name, onLogout }) => (
  <ul className="user-bar-menu">
    <li className="user-bar-menu__item">
      {name}
      {avatar}
    </li>
    <li className="user-bar-menu__item">
      <Link to="/user-profile">
        <FormattedMessage id="user.profile" />
        <UserIcon />
      </Link>
    </li>
    <li className="user-bar-menu__item">
      <Link to="/cohorts">
        <FormattedMessage id="app.user-bar.my-cohorts" />
        <CohortIcon />
      </Link>
    </li>
    <li className="user-bar-menu__item">
      <button
        className="user-bar-menu__logout"
        onClick={onLogout}
        type="button"
      >
        <FormattedMessage id="app.user-bar.logout" />
        <LogoutIcon />
      </button>
    </li>
  </ul>
);

UserBarMenu.propTypes = {
  avatar: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,

  onLogout: PropTypes.func.isRequired
};

export default UserBarMenu;
