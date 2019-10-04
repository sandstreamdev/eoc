import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { UserIcon } from 'assets/images/icons';
import './Avatar.scss';

class Avatar extends PureComponent {
  state = {
    isAvatarError: false
  };

  handleAvatarError = () => this.setState({ isAvatarError: true });

  render() {
    const { isAvatarError } = this.state;
    const { avatarUrl, className, name } = this.props;

    return (
      <span className="avatar">
        {avatarUrl && !isAvatarError ? (
          <img
            alt={name}
            className={classNames(`${className} avatar__image`, {
              avatar__placeholder: isAvatarError
            })}
            onError={this.handleAvatarError}
            src={avatarUrl}
            title={name}
          />
        ) : (
          <UserIcon label={name} />
        )}
      </span>
    );
  }
}

Avatar.propTypes = {
  avatarUrl: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string
};

export default Avatar;
