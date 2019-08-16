import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'common/components/Avatar';
import MemberRole from 'common/components/Members/components/MemberRole';

const MemberDetailsHeader = ({
  avatarUrl,
  displayName,
  isCohortList,
  isGuest,
  isMember,
  isOwner
}) => (
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
      <MemberRole
        isCohortList={isCohortList}
        isGuest={isGuest}
        isMember={isMember}
        isOwner={isOwner}
      />
    </div>
  </header>
);

MemberDetailsHeader.propTypes = {
  avatarUrl: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  isCohortList: PropTypes.bool,
  isGuest: PropTypes.bool,
  isMember: PropTypes.bool,
  isOwner: PropTypes.bool
};

export default MemberDetailsHeader;
