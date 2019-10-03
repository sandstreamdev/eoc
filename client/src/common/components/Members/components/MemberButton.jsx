import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Avatar from 'common/components/Avatar';
import './MemberButton.scss';
import { formatName } from 'common/utils/helpers';
import { IntlPropType } from 'common/constants/propTypes';

const MemberButton = ({
  intl: { formatMessage },
  member,
  onDisplayDetails
}) => {
  const formattedName = formatName(member.displayName, formatMessage);

  return (
    <button
      className="member-button"
      onClick={onDisplayDetails}
      title={formatName(undefined, formatMessage)}
      type="button"
    >
      <Avatar
        avatarUrl={member.avatarUrl}
        className="member-button__avatar"
        name={formattedName}
      />
    </button>
  );
};

MemberButton.propTypes = {
  intl: IntlPropType.isRequired,
  member: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ).isRequired,
  onDisplayDetails: PropTypes.func.isRequired
};

export default injectIntl(MemberButton);
