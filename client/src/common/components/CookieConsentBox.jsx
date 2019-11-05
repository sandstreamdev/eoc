import React, { Fragment } from 'react';
import CookieConsent from 'react-cookie-consent';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import FocusLock from 'react-focus-lock';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import './CookieConsentBox.scss';

const CookieConsentBox = ({ isPrivacyPolicyPage, onAccept }) => (
  <Fragment>
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
        {!isPrivacyPolicyPage && (
          <Fragment>
            <br />
            <FormattedMessage id="common.cookie-consent.privacy-1" />
            <Link className="cookie-consent__link" to="/privacy-policy">
              <FormattedMessage id="common.cookie-consent.privacy-2" />
            </Link>
          </Fragment>
        )}
      </CookieConsent>
    </FocusLock>
  </Fragment>
);

CookieConsentBox.propTypes = {
  isPrivacyPolicyPage: PropTypes.bool,

  onAccept: PropTypes.func.isRequired
};

export default CookieConsentBox;
