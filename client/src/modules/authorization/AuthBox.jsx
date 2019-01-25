import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import AppLogo from 'common/components/AppLogo';
import { ENDPOINT_URL } from 'common/constants/variables';
import MessageBox from 'common/components/MessageBox';
import { AuthStatusType, MessageType } from 'common/constants/enums';

const AuthBox = ({
  match: {
    params: { authStatus }
  }
}) => (
  <Fragment>
    {authStatus === AuthStatusType.FAILURE && (
      <MessageBox
        message="Oops, it looks like we have temporary technical problems. Please try again."
        type={MessageType.ERROR}
      />
    )}
    <div className="authbox">
      <div className="authbox__intro">
        <AppLogo />
        <span className="authbox__subheading">When the fridge is empty...</span>
      </div>
      <div className="authbox__buttons">
        <h1 className="authbox__heading">Sign in:</h1>
        <a className="google-button" href={`${ENDPOINT_URL}/auth/google`}>
          <img
            alt="Google Icon"
            className="google-button__img"
            src="client/src/assets/images/google-btn.png"
          />
        </a>
      </div>
    </div>
  </Fragment>
);

AuthBox.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  })
};

export default AuthBox;
