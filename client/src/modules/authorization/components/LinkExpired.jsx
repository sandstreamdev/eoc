import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import AppLogo from 'common/components/AppLogo';
import { IntlPropType, RouterMatchPropType } from 'common/constants/propTypes';
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

    return resendConfirmationLink(hash)
      .then(() => this.setState({ isLinkSuccessfullySent: true }))
      .catch(() => this.setState({ sendingFailed: true }));
  };

  renderResendingError = () => {
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <p className="link-expired__error">
        {formatMessage({
          id: 'common.something-went-wrong'
        })}
      </p>
    );
  };

  renderSuccessMessage = () => {
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <p className="link-expired__confirmation">
        {formatMessage({
          id: 'authorization.sign-up.confirmation-link-resent'
        })}
      </p>
    );
  };

  renderResendButton = () => {
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <Fragment>
        <p className="link-expired__message">
          <FormattedMessage id="authorization.sign-up.result.failed" />
        </p>
        <div>
          <PendingButton
            className="primary-button link-expired__button"
            onClick={this.handleResendLink}
            preloaderTheme={PreloaderTheme.LIGHT}
            type="button"
          >
            {formatMessage({
              id: 'authorization.sign-up.button.resend-link'
            })}
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
  intl: IntlPropType.isRequired,
  match: RouterMatchPropType.isRequired
};

export default injectIntl(LinkExpired);
