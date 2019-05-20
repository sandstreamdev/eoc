import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import AppLogo from 'common/components/AppLogo';
import { COMPANY_PAGE_URL } from 'common/constants/variables';
import { checkIfCookieSet } from 'common/utils/cookie';
import CookieConsentBox from 'common/components/CookieConsentBox';
import { loginDemoUser } from 'modules/authorization/model/actions';
import PendingButton from 'common/components/PendingButton';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import GoogleButtonImg from '../../assets/images/google-btn.png';

class AuthBox extends PureComponent {
  state = {
    isCookieSet: true,
    pending: false
  };

  componentDidMount() {
    const isCookieSet = checkIfCookieSet('eoc_cookie-consent');
    this.setState({ isCookieSet });
  }

  handleLaunchingDemo = () => {
    const { loginDemoUser } = this.props;

    return loginDemoUser();
  };

  handleCookieAccept = () => this.setState({ isCookieSet: true });

  handleLogin = () => this.setState({ pending: true });

  render() {
    const { isCookieSet, pending } = this.state;

    return (
      <Fragment>
        <div className="authbox">
          <div className="authbox__left">
            <h2 className="authbox__heading">End Of Coffee</h2>
            <p className="authbox__description">
              The best app to track your office inventory.
            </p>
          </div>
          <div className="authbox__right">
            <div className="authbox__intro">
              <AppLogo />
            </div>
            <div className="authbox__buttons">
              <h1 className="authbox__sign-in">Sign in with:</h1>
              <div className="authbox__button-wrapper">
                <a
                  className={classNames('google-button', {
                    'disabled-google-button': !isCookieSet || pending
                  })}
                  onClick={this.handleLogin}
                  href="/auth/google"
                  tabIndex={!isCookieSet ? '-1' : '1'}
                >
                  <img
                    alt="Sign in with Google"
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
            </div>
            <div className="authbox__demo">
              <h1 className="authbox__sign-in">Try it out:</h1>
              <div className="authbox__button-wrapper">
                <PendingButton
                  className="primary-button authbox__demo-button"
                  disable={!isCookieSet || pending}
                  onClick={this.handleLaunchingDemo}
                  preloaderTheme={PreloaderTheme.LIGHT}
                >
                  Demo
                </PendingButton>
              </div>
            </div>
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
        {!isCookieSet && (
          <CookieConsentBox isAuthPage onAccept={this.handleCookieAccept} />
        )}
      </Fragment>
    );
  }
}

AuthBox.propTypes = {
  loginDemoUser: PropTypes.func.isRequired
};

export default connect(
  null,
  { loginDemoUser }
)(AuthBox);
