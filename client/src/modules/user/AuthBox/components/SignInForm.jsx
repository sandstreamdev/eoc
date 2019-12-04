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
import { signIn } from 'modules/user/model/actions';
import PendingButton from 'common/components/PendingButton';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise, validateWith } from 'common/utils/helpers';
import { UnauthorizedException } from 'common/exceptions/UnauthorizedException';
import GoogleButtonImg from 'assets/images/google-btn.png';
import { IntlPropType } from 'common/constants/propTypes';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import './SignInForm.scss';

class SignInForm extends PureComponent {
  pendingPromise = null;

  state = {
    email: '',
    isEmailValid: false,
    isFormValid: false,
    isPasswordValid: false,
    password: '',
    pending: false,
    signInErrorId: ''
  };

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

  emailValidator = value =>
    validateWith(value => isEmail(value))('user.auth.input.email.invalid')(
      value
    );

  handleLogin = () => this.setState({ pending: true });

  isFormValid = () => {
    const { isEmailValid, isPasswordValid, signInErrorId } = this.state;

    return this.setState({
      isFormValid: isEmailValid && isPasswordValid && !signInErrorId
    });
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
    const { isFormValid, pending, signInErrorId } = this.state;
    const {
      intl: { formatMessage },
      isCookieSet
    } = this.props;
    const hasSignUpFailed = signInErrorId.length > 0;

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
            <div className="authbox__button-wrapper">
              <a
                className={classNames('google-button', {
                  'disabled-google-button': !isCookieSet || pending
                })}
                href="/auth/google"
                onClick={this.handleLogin}
                tabIndex={!isCookieSet ? '-1' : '1'}
              >
                <img
                  alt={formatMessage({
                    id: 'user.auth-box.sign-in-google'
                  })}
                  className="google-button__img"
                  src={GoogleButtonImg}
                />
              </a>
              {pending && (
                <Preloader
                  size={PreloaderSize.SMALL}
                  theme={PreloaderTheme.GOOGLE}
                />
              )}
            </div>
          </form>
          {this.renderForgotPassword()}
        </div>
      </AuthLayout>
    );
  }
}

SignInForm.propTypes = {
  intl: IntlPropType.isRequired,
  isCookieSet: PropTypes.bool,

  signIn: PropTypes.func.isRequired
};

export default _flowRight(injectIntl, connect(null, { signIn }))(SignInForm);
