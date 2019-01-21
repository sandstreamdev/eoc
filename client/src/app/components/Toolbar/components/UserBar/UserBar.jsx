import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { logoutCurrentUser } from 'modules/authorization/model/actions';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import SettingsIcon from 'assets/images/cog-solid.svg';
import UserIcon from 'assets/images/user-solid.svg';
import LogoutIcon from 'assets/images/sign-out.svg';

class UserBar extends Component {
  state = {
    hideMenu: true
  };

  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;
    logoutCurrentUser();
  };

  handleShowMenu = () => {
    const { hideMenu } = this.state;
    this.setState({ hideMenu: !hideMenu });
  };

  render() {
    const {
      currentUser: { avatar, name }
    } = this.props;
    const { hideMenu } = this.state;

    return (
      <div className="user-bar">
        <a
          className="user-bar__wrapper"
          onClick={this.handleShowMenu}
          href="#!"
        >
          Profile:
          <img alt="User avatar" className="user-bar__avatar" src={avatar} />
          <div
            className={classNames('user-bar__menu-wrapper', {
              hidden: hideMenu
            })}
          >
            <ul className="user-bar__menu">
              <li className="user-bar__menu-item">
                {`Loged as:  ${name}`}
                <img
                  alt="User Icon"
                  className="user-bar__menu-icon"
                  src={UserIcon}
                />
              </li>
              <li className="user-bar__menu-item">
                Profile settings
                <img
                  alt="Settings icon"
                  className="user-bar__menu-icon"
                  src={SettingsIcon}
                />
              </li>
              <li className="user-bar__menu-item">
                <button
                  className="user-bar__menu-logout"
                  onClick={this.handleLogOut}
                  type="button"
                >
                  Logout
                  <img
                    alt="Log out"
                    className="user-bar__menu-icon"
                    src={LogoutIcon}
                  />
                </button>
              </li>
            </ul>
          </div>
        </a>
      </div>
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
