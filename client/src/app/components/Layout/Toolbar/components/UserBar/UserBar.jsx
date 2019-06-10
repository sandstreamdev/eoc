import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { logoutCurrentUser } from 'modules/authorization/model/actions';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import { LogoutIcon, UserIcon, CohortIcon } from 'assets/images/icons';
import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import { KeyCodes } from 'common/constants/enums';
import Avatar from 'common/components/Avatar';

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
    if (code === KeyCodes.ESCAPE) {
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
            <Avatar
              avatarUrl={avatarUrl}
              className="user-bar__avatar"
              name={name}
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
                <UserIcon />
              </li>
              <li className="user-bar__menu-item">
                <Link to="/cohorts">
                  My cohorts
                  <CohortIcon />
                </Link>
              </li>
              <li className="user-bar__menu-item">
                <button
                  className="user-bar__menu-logout"
                  onClick={this.handleLogOut}
                  type="button"
                >
                  Logout
                  <LogoutIcon />
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
