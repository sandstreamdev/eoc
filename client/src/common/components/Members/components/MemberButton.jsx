import React from 'react';
import PropTypes from 'prop-types';
import { Reference } from 'react-popper';

const MemberButton = ({ onDisplayDetails, member }) => (
  <Reference>
    {({ ref }) => (
      <button
        className="member-button"
        ref={ref}
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
    )}
  </Reference>
);

MemberButton.propTypes = {
  member: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ).isRequired,

  onDisplayDetails: PropTypes.func.isRequired
};

export default MemberButton;
