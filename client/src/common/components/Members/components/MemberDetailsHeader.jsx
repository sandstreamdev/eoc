import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Avatar from 'common/components/Avatar';
import './MemberDetailsHeader.scss';
import { formatName } from 'common/utils/helpers';
import { IntlPropType } from 'common/constants/propTypes';

const MemberDetailsHeader = ({
  avatarUrl,
  displayName,
  intl: { formatMessage },
  role
}) => {
  const formattedName = formatName(displayName, formatMessage);

  return (
    <header className="member-details-header">
      <div className="member-details-header__avatar">
        <Avatar
          avatarUrl={avatarUrl}
          className="member-details-header__image"
          name={formattedName}
        />
      </div>
      <div>
        <h3 className="member-details-header__name">{formattedName}</h3>
        {role}
      </div>
    </header>
  );
};

MemberDetailsHeader.propTypes = {
  avatarUrl: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  intl: IntlPropType.isRequired,
  role: PropTypes.any
};

export default injectIntl(MemberDetailsHeader);
