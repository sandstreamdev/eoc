import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ENDPOINT_URL, FRONTED_URL } from '../../common/variables';
import { logoutCurrentUser } from './actions';
import { getCurrentUser } from '../../selectors';
import { UserPropType } from '../../common/propTypes';

class UserBar extends Component {
  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;

    fetch(`${ENDPOINT_URL}/logout`, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'include'
    })
      .then(() => {
        window.location.replace(FRONTED_URL);

        logoutCurrentUser();
      })
      .catch(err => {
        throw new Error(err.message);
      });
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
              src="src/client/assets/images/sign-out.svg"
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
