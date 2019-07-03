import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import AppLogo from 'common/components/AppLogo';
import { RouterMatchPropType } from 'common/constants/propTypes';
import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';
import { resendConfirmationLink } from 'modules/authorization/model/actions';

class LinkExpired extends PureComponent {
  state = {
    isLinkSuccessfullySent: false,
    sendingFailed: false
  };

  handleResendLink = () => {
    const {
      match: {
        params: { hash }
      }
    } = this.props;

    // if token resendResetLink();

    return resendConfirmationLink(hash)
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

  renderResendButton = () => (
    <Fragment>
      <p className="link-expired__message">
        <FormattedMessage id="authorization.sign-up.result-failed" />
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
