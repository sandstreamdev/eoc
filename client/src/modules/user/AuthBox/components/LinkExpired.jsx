import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { RouterMatchPropType } from 'common/constants/propTypes';
import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';
import { resendConfirmationLink } from 'modules/user/model/actions';
import HomeLink from 'common/components/HomeLink';
import './LinkExpired.scss';

class LinkExpired extends PureComponent {
  state = {
    isLinkSuccessfullySent: false,
    sendingFailed: false
  };

  handleResendLink = () => {
    const {
      match: {
        params: { token }
      }
    } = this.props;

    return resendConfirmationLink(token)
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

  renderResendButton = () => (
    <Fragment>
      <p className="link-expired__message">
        <FormattedMessage id="user.actions.sign-up.result-failed" />
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

  render() {
    const { isLinkSuccessfullySent, sendingFailed } = this.state;

    return (
      <div className="link-expired">
        <h1 className="link-expired__heading">
          <HomeLink />
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
