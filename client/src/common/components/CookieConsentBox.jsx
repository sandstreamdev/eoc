import React from 'react';
import CookieConsent from 'react-cookie-consent';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import FocusLock from 'react-focus-lock';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import './CookieConsentBox.scss';

const CookieConsentBox = ({ isPrivacyPolicyPage, onAccept }) => {
  const cookieLink = (
    <Link className="cookie-consent__link" to="/cookie-policy">
      <FormattedMessage id="app.footer.cookie-policy" />
    </Link>
  );
  const privacyLink = (
    <Link className="cookie-consent__link" to="/privacy-policy">
      <FormattedMessage id="app.footer.privacy" />
    </Link>
  );

  return (
    <>
      {!isPrivacyPolicyPage && <Overlay type={OverlayStyleType.MEDIUM} />}
      <FocusLock>
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
          <span> </span>
          <FormattedMessage
            id="common.cookie-consent.policy"
            values={{ cookieLink, privacyLink }}
          />
        </CookieConsent>
      </FocusLock>
    </>
  );
};

CookieConsentBox.propTypes = {
  isPrivacyPolicyPage: PropTypes.bool,

  onAccept: PropTypes.func.isRequired
};

export default CookieConsentBox;
