import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import UserIconPlaceholder from '../../../../assets/images/user.svg';

class MemberButton extends PureComponent {
  state = {
    isAvatarError: false
  };

  handleError = () => this.setState({ isAvatarError: true });

  render() {
    const { member, onDisplayDetails, popperRef } = this.props;
    const { isAvatarError } = this.state;

    return (
      <button
        className={classNames('member-button', {
          'member-button--error': isAvatarError
        })}
        ref={popperRef}
        title={member.displayName}
        type="button"
      >
        <img
          alt={`${member.displayName} avatar`}
          className="member-button__avatar"
          onClick={onDisplayDetails}
          onError={this.handleError}
          src={isAvatarError ? UserIconPlaceholder : member.avatarUrl}
          title={member.displayName}
        />
      </button>
    );
  }
}

MemberButton.propTypes = {
  member: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  ).isRequired,
  popperRef: PropTypes.func,

  onDisplayDetails: PropTypes.func.isRequired
};

export default MemberButton;
