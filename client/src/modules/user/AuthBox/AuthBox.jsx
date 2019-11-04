import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import AppLogo from 'common/components/AppLogo';
import { COMPANY_PAGE_URL } from 'common/constants/variables';
import { loginDemoUser } from 'modules/user/model/actions';
import PendingButton from 'common/components/PendingButton';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import GoogleButtonImg from 'assets/images/google-btn.png';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import { IntlPropType } from 'common/constants/propTypes';
import './AuthBox.scss';

class AuthBox extends PureComponent {
  state = {
    isCookieSet: true,
    isSignInFormVisible: false,
    isSignUpFormVisible: false,
    pending: false
  };

  handleLaunchingDemo = () => {
    const { loginDemoUser } = this.props;

    return loginDemoUser();
  };

  handleLogin = () => this.setState({ pending: true });

  handleSignUpFormVisibility = () =>
    this.setState(({ isSignUpFormVisible }) => ({
      isSignUpFormVisible: !isSignUpFormVisible
    }));

  handleSignInFormVisibility = () =>
    this.setState(({ isSignInFormVisible }) => ({
      isSignInFormVisible: !isSignInFormVisible
    }));

  handleResetAuthBox = () =>
    this.setState({ isSignInFormVisible: false, isSignUpFormVisible: false });

  renderSignInButtons = () => {
    const { isCookieSet, pending } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <div className="authbox__button-container">
        <h1 className="authbox__button-header">
          <FormattedMessage id="user.auth-box.sign-in" />
        </h1>
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
        <div className="authbox__button-wrapper">
          <button
            className="primary-button authbox__button"
            disabled={!isCookieSet || pending}
            onClick={this.handleSignInFormVisibility}
            type="button"
          >
            <FormattedMessage id="user.auth.sign-in" />
          </button>
        </div>
      </div>
    );
  };

  renderSignUpButton = () => {
    const { isCookieSet, pending } = this.state;

    return (
      <div className="authbox__button-container">
        <h1 className="authbox__button-header">
          <FormattedMessage id="user.auth-box.sign-up" />
        </h1>
        <div className="authbox__button-wrapper">
          <button
            className="primary-button authbox__button"
            disabled={!isCookieSet || pending}
            onClick={this.handleSignUpFormVisibility}
            type="button"
          >
            <FormattedMessage id="user.auth-box.create-account" />
          </button>
        </div>
      </div>
    );
  };

  renderDemoButton = () => {
    const { isCookieSet, pending } = this.state;

    return (
      <div className="authbox__button-container">
        <h1 className="authbox__button-header">
          <FormattedMessage id="user.auth-box.cta" />
        </h1>
        <div className="authbox__button-wrapper">
          <PendingButton
            className="primary-button authbox__button"
            disabled={!isCookieSet || pending}
            onClick={this.handleLaunchingDemo}
            preloaderTheme={PreloaderTheme.LIGHT}
          >
            <FormattedMessage id="user.auth-box.demo-button" />
          </PendingButton>
        </div>
      </div>
    );
  };

  renderForms = () => {
    const { isSignInFormVisible, isSignUpFormVisible } = this.state;

    if (isSignInFormVisible) {
      return <SignInForm onCancel={this.handleSignInFormVisibility} />;
    }

    if (isSignUpFormVisible) {
      return <SignUpForm onCancel={this.handleSignUpFormVisibility} />;
    }
  };

  render() {
    const { isSignInFormVisible, isSignUpFormVisible } = this.state;

    const areFormsVisible = isSignUpFormVisible || isSignInFormVisible;

    return (
      <Fragment>
        <div className="authbox">
          <div className="authbox__left">
            <h2 className="authbox__heading">
              <FormattedMessage id="common.app-name" />
            </h2>
            <p className="authbox__description">
              <FormattedMessage id="user.auth-box.description" />
            </p>
          </div>
          <div className="authbox__right">
            <div className="authbox__intro">
              <button
                className="authbox__reset-button"
                onClick={this.handleResetAuthBox}
                type="button"
              >
                <AppLogo />
              </button>
            </div>
            {areFormsVisible ? (
              this.renderForms()
            ) : (
              <Fragment>
                {this.renderSignInButtons()}
                {this.renderSignUpButton()}
                {this.renderDemoButton()}
              </Fragment>
            )}
            <footer className="authbox__footer">
              <a
                className="authbox__link"
                href={COMPANY_PAGE_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                www.sandstream.pl
              </a>
            </footer>
          </div>
        </div>
      </Fragment>
    );
  }
}

AuthBox.propTypes = {
  intl: IntlPropType.isRequired,
  loginDemoUser: PropTypes.func.isRequired
};

export default _flowRight(
  injectIntl,
  connect(
    null,
    { loginDemoUser }
  )
)(AuthBox);
