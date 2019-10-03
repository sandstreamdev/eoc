import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Avatar from 'common/components/Avatar';
import './UserProfileHeader.scss';
import { formatName } from 'common/utils/helpers';
import { IntlPropType } from 'common/constants/propTypes';

const UserProfileHeader = ({ avatarUrl, intl: { formatMessage }, name }) => {
  const formattedName = formatName(name, formatMessage);

  return (
    <h1 className="user-profile-header">
      <span>
        <Avatar
          avatarUrl={avatarUrl}
          className="user-profile-header__avatar"
          name={formattedName}
        />
      </span>
      {formattedName}
    </h1>
  );
};

UserProfileHeader.propTypes = {
  avatarUrl: PropTypes.string,
  intl: IntlPropType.isRequired,
  name: PropTypes.string
};

export default injectIntl(UserProfileHeader);
