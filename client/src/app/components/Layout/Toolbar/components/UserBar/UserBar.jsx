import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logoutCurrentUser } from 'modules/user/model/actions';
import { getCurrentUser } from 'modules/user/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import Avatar from 'common/components/Avatar';
import Dropdown from 'common/components/Dropdown';
import UserBarMenu from './UserBarMenu';
import './UserBar.scss';

class UserBar extends Component {
  handleLogOut = () => {
    const { logoutCurrentUser } = this.props;
    logoutCurrentUser();
  };

  render() {
    const {
      currentUser: { avatarUrl, name }
    } = this.props;
    const avatar = (
      <Avatar avatarUrl={avatarUrl} className="user-bar__avatar" name={name} />
    );

    return (
      <Dropdown
        buttonClassName="user-bar__button"
        buttonContent={avatar}
        dropdownClassName="user-bar__menu-wrapper"
        dropdownName="user bar"
      >
        <UserBarMenu avatar={avatar} name={name} onLogout={this.handleLogOut} />
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
