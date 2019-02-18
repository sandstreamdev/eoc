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
  constructor(props) {
    super(props);
    this.userBarMenuRef = React.createRef();
  }

  state = {
    hideMenu: true
  };

  componentWillUnmount() {
    this.removeEventListeners();
  }

  addEventListeners = () => {
    document.addEventListener('click', this.hideMenu);
    document.addEventListener('keydown', this.onPressEscape);
  };

  removeEventListeners = () => {
    document.removeEventListener('click', this.hideMenu);
    document.removeEventListener('keydown', this.onPressEscape);
  };

  hideMenu = e => {
    if (!this.userBarMenuRef.current.contains(e.target)) {
      this.setState({ hideMenu: true });
      this.removeEventListeners();
    }
  };

  showMenu = () => {
    this.setState({ hideMenu: false });
    this.addEventListeners();
  };

  onPressEscape = e => (e.code === 'Escape' ? this.hideMenu(e) : null);

  toggleMenuVisibility = e => {
    const { hideMenu } = this.state;
    hideMenu ? this.showMenu() : this.hideMenu(e);
  };

  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;
    logoutCurrentUser();
  };

  render() {
    const { hideMenu } = this.state;
    const {
      currentUser: { avatarUrl, name }
    } = this.props;

    return (
      <div className="user-bar">
        <button
          className="user-bar__button z-index-high"
          onClick={this.toggleMenuVisibility}
          type="button"
        >
          Profile:
          <img alt="User avatar" className="user-bar__avatar" src={avatarUrl} />
        </button>

        <div
          className={classNames('user-bar__menu-wrapper z-index-high', {
            hidden: hideMenu
          })}
          ref={this.userBarMenuRef}
        >
          <ul className="user-bar__menu">
            <li className="user-bar__menu-item">
              {`Logged as:  ${name}`}
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
      </div>
    );
  }
}

UserBar.propTypes = {
  currentUser: UserPropType.isRequired,

  logoutCurrentUser: PropTypes.func.isRequired
  // onClick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { logoutCurrentUser }
)(UserBar);
