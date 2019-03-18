import React, { Fragment, PureComponent } from 'react';
import CookieConsent from 'react-cookie-consent';
import classNames from 'classnames';

import AppLogo from 'common/components/AppLogo';
import { COMPANY_PAGE_URL, ENDPOINT_URL } from 'common/constants/variables';
import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import { checkIfCookieSet } from 'common/utils/cookie';

class AuthBox extends PureComponent {
  state = {
    isCookieSet: false
  };

  componentDidMount() {
    const isCookieSet = checkIfCookieSet('eoc_cookie-consent');
    this.setState({ isCookieSet });
  }

  handleCookieAccept = () => this.setState({ isCookieSet: true });

  render() {
    const { isCookieSet } = this.state;
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
              <a
                className={classNames('google-button', {
                  'disabled-button': !isCookieSet
                })}
                href={`${ENDPOINT_URL}/auth/google`}
                tabIndex={!isCookieSet ? '-1' : '1'}
              >
                <img
                  alt="Google Icon"
                  className="google-button__img"
                  src="client/src/assets/images/google-btn.png"
                />
              </a>
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
          <Fragment>
            <Overlay type={OverlayStyleType.MEDIUM} />
            <CookieConsent
              buttonClasses="primary-button"
              buttonText="Accept"
              containerClasses="cookie-consent"
              contentClasses="cookie-consent__content"
              cookieName="eoc_cookie-consent"
              disableStyles
              expires={365}
              location="bottom"
              onAccept={this.handleCookieAccept}
            >
              We use cookies to ensure you get the best experience. By using
              this website, you consent to use of these cookies.
            </CookieConsent>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default AuthBox;
