import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import AppLogo from 'common/components/AppLogo';
import { RouterMatchPropType } from 'common/constants/propTypes';
import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';
import {
  resendConfirmationLink,
  resendRecoveryLink
} from 'modules/user/model/actions';
import { Routes } from 'common/constants/enums';

class LinkExpired extends PureComponent {
  state = {
    isLinkSuccessfullySent: false,
    sendingFailed: false
  };

  handleResendLink = () => {
    const {
      match: {
        params: { token },
        path
      }
    } = this.props;

    let action;

    if (path.includes(Routes.CONFIRMATION_LINK_EXPIRED)) {
      action = resendConfirmationLink;
    }

    if (path.includes(Routes.PASSWORD_RECOVERY_EXPIRED)) {
      action = resendRecoveryLink;
    }

    return action(token)
      .then(() => this.setState({ isLinkSuccessfullySent: true }))
      .catch(() => this.setState({ sendingFailed: true }));
  };

  renderResendingError = () => (
    <p className="link-expired__error">
      <FormattedMessage id="common.something-went-wrong" />
    </p>
  );

  renderSuccessMessage = () => (
    <p className="link-expired__confirmation">
      <FormattedMessage id="authorization.sign-up.confirmation-link-resent" />
    </p>
  );

  renderResendButton = () => {
    const {
      match: { url }
    } = this.props;
    const messageId =
      url === `/${Routes.CONFIRMATION_LINK_EXPIRED}`
        ? 'authorization.sign-up.result-failed'
        : 'authorization.link-expired.recovery-expired';

    return (
      <Fragment>
        <p className="link-expired__message">
          <FormattedMessage id={messageId} />
        </p>
        <div>
          <PendingButton
            className="primary-button link-expired__button"
            onClick={this.handleResendLink}
            preloaderTheme={PreloaderTheme.LIGHT}
            type="button"
          >
            <FormattedMessage id="authorization.sign-up.button.resend-link" />
          </PendingButton>
        </div>
      </Fragment>
    );
  };

  render() {
    const { isLinkSuccessfullySent, sendingFailed } = this.state;

    return (
      <div className="link-expired">
        <h1 className="link-expired__heading">
          <AppLogo />
        </h1>
        {sendingFailed && this.renderResendingError()}
        {isLinkSuccessfullySent
          ? this.renderSuccessMessage()
          : this.renderResendButton()}
      </div>
    );
  }
}

LinkExpired.propTypes = {
  match: RouterMatchPropType.isRequired
};

export default LinkExpired;
