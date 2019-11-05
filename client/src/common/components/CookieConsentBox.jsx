import React from 'react';
import CookieConsent from 'react-cookie-consent';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import './CookieConsentBox.scss';

const CookieConsentBox = ({ isAuthPage, onAccept }) => (
  <>
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
      <FormattedMessage id="common.cookie-consent.message" />
      {isAuthPage && (
        <>
          <br />
          <FormattedMessage id="common.cookie-consent.privacy-1" />
          <Link className="cookie-consent__link" to="/privacy-policy">
            <FormattedMessage id="common.cookie-consent.privacy-2" />
          </Link>
        </>
      )}
    </CookieConsent>
  </>
);

CookieConsentBox.propTypes = {
  isAuthPage: PropTypes.bool,

  onAccept: PropTypes.func.isRequired
};

export default CookieConsentBox;
