import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import AppLogo from 'common/components/AppLogo';
import { RouterMatchPropType } from 'common/constants/propTypes';
import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';
import {
  checkToken,
  resendConfirmationLink,
  resendRecoveryLink
} from 'modules/user/model/actions';
import { Routes } from 'common/constants/enums';

class LinkExpired extends PureComponent {
  state = {
    isLinkSuccessfullySent: false,
    sendingFailed: false,
    isTokenValid: false
  };

  componentDidMount() {
    this.checkToken();
  }

  checkToken = () => {
    const {
      match: {
        params: { token }
      }
    } = this.props;

    checkToken(token)
      .then(() => this.setState({ isTokenValid: true }))
      .catch(() => this.setState({ isTokenValid: false }));
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
      <FormattedMessage
        id="user.actions.token-revoked"
        values={{
          link: (
            <Link className="success-message__link" to="/reset-password">
              <FormattedMessage id="user.auth.sign-up.reset-password" />
            </Link>
          )
        }}
      />
    </p>
  );

  renderSuccessMessage = () => (
    <p className="link-expired__confirmation">
      <FormattedMessage id="user.actions.sign-up.confirmation-link-resent" />
    </p>
  );

  renderResendButton = () => {
    const {
      match: { url }
    } = this.props;
    const messageId =
      url === `/${Routes.CONFIRMATION_LINK_EXPIRED}`
        ? 'user.actions.sign-up.result-failed'
        : 'user.actions.link-expired.recovery-expired';

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
            <FormattedMessage id="user.auth.sign-up.button.resend-link" />
          </PendingButton>
        </div>
      </Fragment>
    );
  };

  render() {
    const { isLinkSuccessfullySent, sendingFailed, isTokenValid } = this.state;
    const resendButton = isTokenValid
      ? this.renderResendButton()
      : this.renderResendingError();

    return (
      <div className="link-expired">
        <h1 className="link-expired__heading">
          <AppLogo />
        </h1>
        {sendingFailed && this.renderResendingError()}
        {isLinkSuccessfullySent ? this.renderSuccessMessage() : resendButton}
      </div>
    );
  }
}

LinkExpired.propTypes = {
  match: RouterMatchPropType.isRequired
};

export default LinkExpired;
