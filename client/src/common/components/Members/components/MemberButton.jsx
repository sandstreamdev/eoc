import React from 'react';
import PropTypes from 'prop-types';

const MemberButton = ({ onDisplayDetails, member, popperRef }) => {
  if (!member) {
    return null;
  }

  return (
    <button
      className="member-button"
      ref={popperRef}
      title={member.displayName}
      type="button"
    >
      <img
        alt={`${member.displayName} avatar`}
        className="member-button__avatar"
        onClick={onDisplayDetails}
        src={member.avatarUrl}
        title={member.displayName}
      />
    </button>
  );
};

MemberButton.propTypes = {
  member: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ).isRequired,
  popperRef: PropTypes.func,

  onDisplayDetails: PropTypes.func.isRequired
};

export default MemberButton;
