import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';

class InviteNewUser extends PureComponent {
  render() {
    const { email, onCancel, onInvite } = this.props;

    return (
      <div className="invite-user">
        <p className="invite-user__message">
          User
          <span className="invite-user__email">{` ${email} `}</span>
          has no account in EOC app. Would you like to invite via email?
        </p>
        <footer className="invite-user__footer">
          <PendingButton
            className="primary-button"
            onClick={onInvite}
            preloaderTheme={PreloaderTheme.LIGHT}
            value="Invite user"
            title="Invite user"
          >
            Invite User
          </PendingButton>
          <button className="primary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        </footer>
      </div>
    );
  }
}

InviteNewUser.propTypes = {
  email: PropTypes.string,

  onCancel: PropTypes.func.isRequired,
  onInvite: PropTypes.func.isRequired
};

export default InviteNewUser;
