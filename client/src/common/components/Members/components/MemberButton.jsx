import React from 'react';
import PropTypes from 'prop-types';

import Avatar from 'common/components/Avatar';
import './MemberButton.scss';

const MemberButton = ({ member, onDisplayDetails }) => (
  <button
    className="member-button"
    onClick={onDisplayDetails}
    title={member.displayName}
    type="button"
  >
    <Avatar
      avatarUrl={member.avatarUrl}
      className="member-button__avatar"
      name={member.displayName}
    />
  </button>
);

MemberButton.propTypes = {
  member: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ).isRequired,
  onDisplayDetails: PropTypes.func.isRequired
};

export default MemberButton;
