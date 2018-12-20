import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ENDPOINT_URL } from '../../common/variables';
import { logoutCurrentUser } from './actions';
import { getCurrentUser } from '../../selectors';

class UserBar extends Component {
  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;

    /**
     *  Wait 300ms for backend service to
     *  logout, than execute logout on front.
     */
    setTimeout(() => logoutCurrentUser(), 300);
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

          <a
            className="user-bar__logout"
            href={`${ENDPOINT_URL}/logout`}
            onClick={this.handleLogOut}
          >
            <img
              alt="Log out"
              className="user-bar__icon"
              src="src/client/assets/images/sign-out.svg"
            />
          </a>
        </div>
      </div>
    );
  }
}

UserBar.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.string),
  logoutCurrentUser: PropTypes.func
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { logoutCurrentUser }
)(UserBar);
