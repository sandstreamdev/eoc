import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';
import { PROJECT_NAME } from 'common/constants/variables';
import { IntlPropType } from 'common/constants/propTypes';

const InviteNewUser = ({
  email,
  onCancel,
  onInvite,
  intl: { formatMessage }
}) => (
  <div className="invite-user">
    <p className="invite-user__message">
      User
      <span className="invite-user__email">{` ${email} `}</span>
      {`has no account in ${PROJECT_NAME} app. Would you like to send invite via email?`}
    </p>
    <footer className="invite-user__footer">
      <PendingButton
        className="primary-button"
        onClick={onInvite}
        preloaderTheme={PreloaderTheme.LIGHT}
        title={formatMessage({ id: 'common.invite-new-user.invite' })}
        value="Invite user"
      >
        <FormattedMessage id="common.invite-new-user.invite" />
      </PendingButton>
      <button
        className="primary-button"
        onClick={onCancel}
        title={formatMessage({ id: 'common.invite-new-user.invite' })}
        type="button"
      >
        <FormattedMessage id="common.invite-new-user.cancel" />
      </button>
    </footer>
  </div>
);

InviteNewUser.propTypes = {
  email: PropTypes.string.isRequired,
  intl: IntlPropType.isRequired,

  onCancel: PropTypes.func.isRequired,
  onInvite: PropTypes.func.isRequired
};

export default injectIntl(InviteNewUser);
