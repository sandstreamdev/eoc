import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import _flowRight from 'lodash/flowRight';

import AuthInput from './AuthInput';
import AuthLayout from './AuthLayout';
import AuthCheckbox from './AuthCheckbox';
import { signIn } from 'modules/user/model/actions';
import PendingButton from 'common/components/PendingButton';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise, validateWith } from 'common/utils/helpers';
import { UnauthorizedException } from 'common/exceptions/UnauthorizedException';
import { GoogleIcon } from 'assets/images/icons';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { RouterMatchPropType } from 'common/constants/propTypes';
import { RouteParams } from 'common/constants/enums';
import './SignInForm.scss';

class SignInForm extends PureComponent {
  pendingPromise = null;

  state = {
    email: '',
    isEmailValid: false,
    isFormValid: false,
    isPasswordValid: false,
    isPolicyAccepted: false,
    noAccount: false,
    password: '',
    pending: false,
    signInErrorId: ''
  };

  componentDidMount() {
    const {
      match: {
        params: { feedback }
      }
    } = this.props;

    if (feedback === RouteParams.ERROR) {
      this.setState({ noAccount: true });
    }
  }

  componentDidUpdate() {
    this.isFormValid();
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  onEmailChange = (email, isValid) => {
    const { signInErrorId } = this.state;
    const error = isValid ? '' : signInErrorId;

    this.setState({
      email,
      isEmailValid: isValid,
      signInErrorId: error
    });
  };

  onPasswordChange = (password, isValid) => {
    const { signInErrorId } = this.state;
    const error = isValid ? '' : signInErrorId;

    this.setState(
      {
        password,
        isPasswordValid: isValid,
        signInErrorId: error
      },
      this.comparePasswords
    );
  };

  acceptPolicy = () => this.setState({ isPolicyAccepted: true });

  dismissPolicy = () => this.setState({ isPolicyAccepted: false });

  emailValidator = value =>
    validateWith(value => isEmail(value))('user.auth.input.email.invalid')(
      value
    );

  isFormValid = () => {
    const { isEmailValid, isPasswordValid, signInErrorId } = this.state;

    return this.setState({
      isFormValid: isEmailValid && isPasswordValid && !signInErrorId
    });
  };

  handleSignInWithGoogle = event => {
    event.preventDefault();

    const { noAccount, isPolicyAccepted } = this.state;
    let url = '/auth/google/sign-in';

    if (noAccount) {
      if (!isPolicyAccepted) {
        return;
      }

      const data = {};
      data.policyAcceptedAt = Date.now();

      url = `/auth/google/sign-up/${JSON.stringify(data)}`;
    }

    this.setState({ pending: true });

    window.location = url;
  };

  handleSignIn = event => {
    event.preventDefault();
    const { email, password } = this.state;
    const { signIn } = this.props;

    this.setState({ pending: true });
    this.pendingPromise = makeAbortablePromise(signIn(email, password));

    return this.pendingPromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          const newState = { pending: false };

          if (err instanceof UnauthorizedException) {
            newState.signInErrorId = 'user.actions.sign-in.invalid-credentials';
          } else {
            newState.signInErrorId = 'common.something-went-wrong';
          }

          this.setState(newState);
        }
      });
  };

  renderSignInError = () => {
    const { signInErrorId } = this.state;

    return (
      <p className="sign-in__error">
        <FormattedMessage
          id={signInErrorId}
          values={{
            link: (
              <Link className="sign-in__link" to="/reset-password">
                <FormattedMessage id="user.auth.forgot-password" />
              </Link>
            )
          }}
        />
      </p>
    );
  };

  renderForgotPassword = () => (
    <p className="sign-in__forgot-password">
      <Link className="sign-in__link" to="/reset-password">
        <FormattedMessage id="user.auth.forgot-password" />
      </Link>
    </p>
  );

  render() {
    const {
      isFormValid,
      isPolicyAccepted,
      noAccount,
      pending,
      signInErrorId
    } = this.state;
    const { isCookieSet } = this.props;
    const hasSignUpFailed = signInErrorId.length > 0;
    const isDisabled = !isCookieSet || pending;
    const cookieLink = (
      <Link className="sign-up-form__link" to="/cookie-policy">
        <FormattedMessage id="app.footer.cookie-policy" />
      </Link>
    );
    const privacyLink = (
      <Link className="sign-up-form__link" to="/privacy-policy">
        <FormattedMessage id="app.footer.privacy" />
      </Link>
    );
    const termsLink = (
      <Link className="sign-up-form__link" to="/terms-of-use">
        <FormattedMessage id="app.footer.terms-of-use" />
      </Link>
    );
    const policyLabel = (
      <FormattedMessage
        id="user.auth.input.privacy-policy-agreement"
        values={{
          cookieLink,
          privacyLink,
          termsLink
        }}
      />
    );
    const policyErrorMessage =
      noAccount && !isPolicyAccepted ? (
        <FormattedMessage
          id="user.auth.input.privacy-policy-agreement-required"
          values={{
            cookieLink,
            privacyLink,
            termsLink
          }}
        />
      ) : null;

    return (
      <AuthLayout>
        <div className="sign-in">
          <h1 className="sign-in__heading">
            <FormattedMessage id="user.auth.sign-in" />
          </h1>
          {signInErrorId && this.renderSignInError()}
          <form
            className="sign-in__form"
            noValidate
            onSubmit={isFormValid && !pending ? this.handleSignIn : null}
          >
            <AuthInput
              disabled={pending}
              focus
              formError={hasSignUpFailed}
              labelId="user.email"
              name="email"
              onChange={this.onEmailChange}
              type="text"
              validator={this.emailValidator}
            />
            <AuthInput
              disabled={pending}
              formError={hasSignUpFailed}
              labelId="user.password"
              name="password"
              noSuccessTheme
              onChange={this.onPasswordChange}
              type="password"
            />
            <div className="sign-in__buttons">
              <Link className="primary-link-button" to="/">
                <FormattedMessage id="common.button.cancel" />
              </Link>
              <PendingButton
                className="primary-button sign-in__confirm"
                disabled={!isFormValid}
                onClick={this.handleSignIn}
                type="submit"
              >
                <FormattedMessage id="user.auth.sign-in" />
              </PendingButton>
            </div>
            <h2>
              <FormattedMessage id="user.auth.or" />
            </h2>
            {noAccount && (
              <AuthCheckbox
                checked={isPolicyAccepted}
                disabled={pending}
                errorMessage={policyErrorMessage}
                label={policyLabel}
                name="policy-acceptation"
                onChange={
                  isPolicyAccepted ? this.dismissPolicy : this.acceptPolicy
                }
                value="accepted"
              />
            )}
            <div className="sign-in__buttons">
              <button
                className={classNames('primary-button google-button', {
                  'disabled-google-button': isDisabled
                })}
                onClick={this.handleSignInWithGoogle}
                type="submit"
              >
                <GoogleIcon />
                {noAccount ? (
                  <FormattedMessage id="user.auth.sign-up-with-google" />
                ) : (
                  <FormattedMessage id="user.auth.sign-in-with-google" />
                )}
                {pending && <Preloader size={PreloaderSize.SMALL} />}
              </button>
            </div>
          </form>
          {this.renderForgotPassword()}
        </div>
      </AuthLayout>
    );
  }
}

SignInForm.propTypes = {
  isCookieSet: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  signIn: PropTypes.func.isRequired
};

export default _flowRight(injectIntl, connect(null, { signIn }))(SignInForm);
