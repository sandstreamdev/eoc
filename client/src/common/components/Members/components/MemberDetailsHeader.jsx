import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'common/components/Avatar';

const MemberDetailsHeader = ({ avatarUrl, displayName, role }) => (
  <header className="member-details-header">
    <div className="member-details-header__avatar">
      <Avatar
        avatarUrl={avatarUrl}
        className="member-details-header__image"
        name={displayName}
      />
    </div>
    <div>
      <h3 className="member-details-header__name">{displayName}</h3>
      {role}
    </div>
  </header>
);

MemberDetailsHeader.propTypes = {
  avatarUrl: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  role: PropTypes.any
};

export default MemberDetailsHeader;
