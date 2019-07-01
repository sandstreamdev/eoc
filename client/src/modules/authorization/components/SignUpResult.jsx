import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import AppLogo from 'common/components/AppLogo';
import { IntlPropType, RouterMatchPropType } from 'common/constants/propTypes';
import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';
import { resendConfirmationLink } from 'modules/authorization/model/actions';

class SignUpResult extends PureComponent {
  state = {
    confirmationResent: false,
    resendFailed: false
  };

  handleResendLink = () => {
    const {
      match: {
        params: { hash }
      }
    } = this.props;

    return resendConfirmationLink(hash)
      .then(() => this.setState({ confirmationResent: true }))
      .catch(() => this.setState({ resendFailed: true }));
  };

  renderResendingError = () => {
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <p className="sign-up-result__error">
        {formatMessage({
          id: 'common.something-went-wrong'
        })}
      </p>
    );
  };

  renderResendConfirmation = () => {
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <p className="sign-up-result__confirmation">
        {formatMessage({
          id: 'authorization.sign-up.confirmation-link-resent'
        })}
      </p>
    );
  };

  renderSignUpResult = () => {
    const {
      intl: { formatMessage },
      match: {
        params: { hash, result }
      }
    } = this.props;

    return (
      <Fragment>
        <p className="sign-up-result__message">
          <FormattedMessage
            id={
              result === 'success'
                ? 'authorization.sign-up.result.success'
                : 'authorization.sign-up.result.failed'
            }
            values={{
              link: (
                <Link className="sign-up-result__link" to="/">
                  {formatMessage({
                    id: 'authorization.sign-up.result.link'
                  })}
                </Link>
              )
            }}
          />
        </p>
        {result === 'failed' && hash && (
          <div>
            <PendingButton
              className="primary-button sign-up-result__button"
              onClick={this.handleResendLink}
              preloaderTheme={PreloaderTheme.LIGHT}
              type="button"
            >
              {formatMessage({
                id: 'authorization.sign-up.button.resend-link'
              })}
            </PendingButton>
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    const { confirmationResent, resendFailed } = this.state;

    return (
      <div className="sign-up-result">
        <h1 className="sign-up-result__heading">
          <AppLogo />
        </h1>
        {resendFailed && this.renderResendingError()}
        {confirmationResent
          ? this.renderResendConfirmation()
          : this.renderSignUpResult()}
      </div>
    );
  }
}

SignUpResult.propTypes = {
  intl: IntlPropType.isRequired,
  match: RouterMatchPropType.isRequired
};

export default injectIntl(SignUpResult);
