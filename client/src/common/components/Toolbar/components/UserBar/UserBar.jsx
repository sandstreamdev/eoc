import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { logoutCurrentUser } from 'modules/authorization/model/actions';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import UserIcon from 'assets/images/user-solid.svg';
import LogoutIcon from 'assets/images/sign-out.svg';
import Overlay, { OverlayStyleType } from 'common/components/Overlay';

class UserBar extends Component {
  state = {
    isVisible: false
  };

  componentDidMount() {
    document.addEventListener('keydown', this.escapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeListener);
  }

  escapeListener = event => {
    const { code } = event;
    if (code === 'Escape') {
      this.setState({
        isVisible: false
      });
    }
  };

  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;
    logoutCurrentUser();
  };

  toggleMenu = () =>
    this.setState(({ isVisible: prevValue }) => ({ isVisible: !prevValue }));

  render() {
    const {
      currentUser: { avatarUrl, name }
    } = this.props;

    const { isVisible } = this.state;

    return (
      <Fragment>
        <div className="user-bar">
          <button
            className={classNames('user-bar__button', {
              'z-index-high': isVisible
            })}
            onClick={this.toggleMenu}
            type="button"
          >
            <img
              alt="User avatar"
              className="user-bar__avatar"
              src={avatarUrl}
            />
          </button>
          <div
            className={classNames('user-bar__menu-wrapper z-index-high', {
              hidden: !isVisible
            })}
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
        {isVisible && (
          <Overlay onClick={this.toggleMenu} type={OverlayStyleType.LIGHT} />
        )}
      </Fragment>
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
