import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import UserIconPlaceholder from 'assets/images/user.svg';

class MemberButton extends PureComponent {
  state = {
    isError: false
  };

  handleError = () => this.setState({ isError: true });

  render() {
    const { onDisplayDetails, member, popperRef } = this.props;
    const { isError } = this.state;

    return (
      <button
        className={classNames('member-button', {
          'member-button--error': isError
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
          src={isError ? UserIconPlaceholder : member.avatarUrl}
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
