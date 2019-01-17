import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logoutCurrentUser } from './actions';
import { getCurrentUser } from 'modules/legacy/selectors';
import { UserPropType } from 'common/constants/propTypes';

class UserBar extends Component {
  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;

    logoutCurrentUser();
  };

  render() {
    const {
      currentUser: { avatar, name }
    } = this.props;

    return (
      <div className="user-bar">
        <div className="user-bar__wrapper">
          <img alt="User avatar" className="user-bar__avatar" src={avatar} />
          <div className="user-bar__logged">
            <span className="user-bar__user-data">Logged as:</span>
            <span className="user-bar__user-data">{name}</span>
          </div>
          <button
            className="user-bar__logout"
            onClick={this.handleLogOut}
            type="button"
          >
            <img
              alt="Log out"
              className="user-bar__icon"
              src="client/src/assets/images/sign-out.svg"
            />
          </button>
        </div>
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
