import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import { UserIcon } from 'assets/images/icons';
import './Avatar.scss';
import { formatName } from 'common/utils/helpers';
import { IntlPropType } from 'common/constants/propTypes';

class Avatar extends PureComponent {
  state = {
    isAvatarError: false
  };

  handleAvatarError = () => this.setState({ isAvatarError: true });

  render() {
    const { isAvatarError } = this.state;
    const {
      avatarUrl,
      className,
      intl: { formatMessage },
      name
    } = this.props;
    const formattedName = formatName(name, formatMessage);

    return (
      <span className="avatar">
        {avatarUrl && !isAvatarError ? (
          <img
            alt={`${formattedName || 'user'} avatar`}
            className={classNames(`${className} avatar__image`, {
              avatar__placeholder: isAvatarError
            })}
            onError={this.handleAvatarError}
            src={avatarUrl}
            title={formattedName}
          />
        ) : (
          <UserIcon />
        )}
      </span>
    );
  }
}

Avatar.propTypes = {
  avatarUrl: PropTypes.string,
  className: PropTypes.string,
  intl: IntlPropType.isRequired,
  name: PropTypes.string
};

export default injectIntl(Avatar);
