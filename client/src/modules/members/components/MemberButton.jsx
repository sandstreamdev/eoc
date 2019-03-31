import React from 'react';
import PropTypes from 'prop-types';
import { Reference } from 'react-popper';

const MemberButton = ({ onDisplayDetails, user }) => (
  <Reference>
    {({ ref }) => (
      <button
        ref={ref}
        className="members-box__member"
        title={user.displayName}
        type="button"
      >
        <img
          alt={`${user.displayName} avatar`}
          className="members-box__avatar"
          onClick={onDisplayDetails}
          src={user.avatarUrl}
          title={user.displayName}
        />
      </button>
    )}
  </Reference>
);

MemberButton.propTypes = {
  user: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ).isRequired,

  onDisplayDetails: PropTypes.func.isRequired
};

export default MemberButton;
