import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { logoutCurrentUser } from 'modules/authorization/model/actions';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import { LogoutIcon, UserIcon, CohortIcon } from 'assets/images/icons';
import Avatar from 'common/components/Avatar';
import Dropdown from 'common/components/Dropdown';

class UserBar extends Component {
  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;
    logoutCurrentUser();
  };

  renderAvatar = () => {
    const {
      currentUser: { avatarUrl, name }
    } = this.props;

    return (
      <Avatar avatarUrl={avatarUrl} className="user-bar__avatar" name={name} />
    );
  };

  renderUserBarMenu = () => {
    const {
      currentUser: { avatarUrl, name }
    } = this.props;

    return (
      <ul className="user-bar__menu">
        <li className="user-bar__menu-item">
          {name}
          <Avatar
            avatarUrl={avatarUrl}
            className="user-bar__avatar"
            name={name}
          />
        </li>
        <li className="user-bar__menu-item">
          <Link to="/user-profile">
            <FormattedMessage id="app.user-bar.user-profile" />
            <UserIcon />
          </Link>
        </li>
        <li className="user-bar__menu-item">
          <Link to="/cohorts">
            <FormattedMessage id="app.user-bar.my-cohorts" />
            <CohortIcon />
          </Link>
        </li>
        <li className="user-bar__menu-item">
          <button
            className="user-bar__menu-logout"
            onClick={this.handleLogOut}
            type="button"
          >
            <FormattedMessage id="app.user-bar.logout" />
            <LogoutIcon />
          </button>
        </li>
      </ul>
    );
  };

  render() {
    return (
      <Dropdown
        buttonClassName="user-bar__button"
        buttonContent={this.renderAvatar()}
        dropdownClassName="user-bar__menu-wrapper"
        dropdownName="user bar"
      >
        {this.renderUserBarMenu()}
      </Dropdown>
    );
  }
}

UserBar.propTypes = {
  currentUser: UserPropType.isRequired,

  logoutCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { logoutCurrentUser }
)(UserBar);
