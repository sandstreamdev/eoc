import React, { Fragment } from 'react';
import CookieConsent from 'react-cookie-consent';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';

const CookieConsentBox = ({ isAuthPage, onAccept }) => (
  <Fragment>
    {isAuthPage && <Overlay type={OverlayStyleType.MEDIUM} />}
    <CookieConsent
      buttonClasses="primary-button"
      buttonText="Accept"
      containerClasses="cookie-consent"
      contentClasses="cookie-consent__content"
      cookieName="eoc_cookie-consent"
      disableStyles
      expires={365}
      location="bottom"
      onAccept={onAccept}
    >
      We use cookies to ensure you get the best experience. By using this
      website, you consent to use of these cookies.
      {isAuthPage && (
        <Fragment>
          <br />
          {'For more information, please see our '}
          <Link to="/privacy-policy">privacy policy</Link>
          {'.'}
        </Fragment>
      )}
    </CookieConsent>
  </Fragment>
);

CookieConsentBox.propTypes = {
  isAuthPage: PropTypes.bool,

  onAccept: PropTypes.func.isRequired
};

export default CookieConsentBox;
