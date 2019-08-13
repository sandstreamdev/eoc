import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import Avatar from 'common/components/Avatar';

const MemberDetailsHeader = ({
  avatarUrl,
  displayName,
  isCohortList,
  isGuest,
  isMember,
  isOwner
}) => {
  let roleToDisplay = (
    <FormattedMessage id="common.member-details.role-viewer" />
  );

  if (isMember) {
    roleToDisplay = <FormattedMessage id="common.member-details.role-member" />;
  }

  if (isOwner) {
    roleToDisplay = <FormattedMessage id="common.member-details.role-owner" />;
  }

  return (
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
        <p className="member-details-header__role">
          {roleToDisplay}
          {isGuest && isCohortList && (
            <FormattedMessage id="common.member-details.role-guest" />
          )}
        </p>
      </div>
    </header>
  );
};

MemberDetailsHeader.propTypes = {
  avatarUrl: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  isCohortList: PropTypes.bool,
  isGuest: PropTypes.bool,
  isMember: PropTypes.bool,
  isOwner: PropTypes.bool
};

export default MemberDetailsHeader;
