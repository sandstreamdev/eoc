import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'common/components/Avatar';
import './UserProfileHeader.scss';

const UserProfileHeader = ({ avatarUrl, name }) => (
  <h1 className="user-profile-header">
    <span>
      <Avatar
        avatarUrl={avatarUrl}
        className="user-profile-header__avatar"
        name={name}
      />
    </span>
    {name}
  </h1>
);

UserProfileHeader.propTypes = {
  avatarUrl: PropTypes.string,
  name: PropTypes.string
};

export default UserProfileHeader;
