import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import { logoutCurrentUser } from 'modules/user/model/actions';
import { getCurrentUser } from 'modules/user/model/selectors';
import { IntlPropType, UserPropType } from 'common/constants/propTypes';
import { LogoutIcon, UserIcon, CohortIcon } from 'assets/images/icons';
import Avatar from 'common/components/Avatar';
import Dropdown from 'common/components/Dropdown';
import './UserBar.scss';
import { formatName } from 'common/utils/helpers';

class UserBar extends Component {
  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;
    logoutCurrentUser();
  };

  renderAvatar = () => {
    const {
      currentUser: { avatarUrl, name },
      intl: { formatMessage }
    } = this.props;
    const formattedName = formatName(name, formatMessage);

    return (
      <Avatar
        avatarUrl={avatarUrl}
        className="user-bar__avatar"
        name={formattedName}
      />
    );
  };

  renderUserBarMenu = () => {
    const {
      currentUser: { avatarUrl, name },
      intl: { formatMessage }
    } = this.props;
    const formattedName = formatName(name, formatMessage);

    return (
      <ul className="user-bar__menu">
        <li className="user-bar__menu-item">
          {formattedName}
          <Avatar
            avatarUrl={avatarUrl}
            className="user-bar__avatar"
            name={formattedName}
          />
        </li>
        <li className="user-bar__menu-item">
          <Link to="/user-profile">
            <FormattedMessage id="user.profile" />
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
  intl: IntlPropType.isRequired,

  logoutCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  connect(
    mapStateToProps,
    { logoutCurrentUser }
  )
)(UserBar);
