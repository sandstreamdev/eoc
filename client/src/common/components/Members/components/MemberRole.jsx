import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const MemberRole = ({ isCohortList, isGuest, isMember, isOwner }) => {
  let messageId = 'common.member-details.role-viewer';

  if (isMember) {
    messageId = 'common.member-details.role-member';
  }

  if (isOwner) {
    messageId = 'common.member-details.role-owner';
  }

  return (
    <p className="member-role">
      <FormattedMessage id={messageId} />
      {isGuest && isCohortList && (
        <FormattedMessage id="common.member-details.role-guest" />
      )}
    </p>
  );
};

MemberRole.propTypes = {
  isCohortList: PropTypes.bool,
  isGuest: PropTypes.bool,
  isMember: PropTypes.bool,
  isOwner: PropTypes.bool
};

export default MemberRole;
