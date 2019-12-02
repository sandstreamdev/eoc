import React, { useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { CheckIcon } from 'assets/images/icons';
import './UserProfileName.scss';

const UserProfileName = () => {
  const [errorMessageId, setErrorMessageId] = useState('');

  return (
    <>
      <span className="user-profile-name__data-name">
        <FormattedMessage id="user.name" />
      </span>
      <span className="user-profile-name__data-name-wrapper">
        <span className="user-profile-name__data-value">
          <form className="user-profile-name__name-form" onSubmit={() => {}}>
            <input
              className="primary-input"
              onChange={() => {}}
              type="text"
              value="UserName"
            />
            <button
              className={classNames('user-profile-name__save-button', {
                'user-profile-name__save-button--disabled': !true
              })}
              type="submit"
            >
              <CheckIcon />
            </button>
          </form>
          {errorMessageId && (
            <span className="error-message">
              <FormattedMessage id={errorMessageId} />
            </span>
          )}
        </span>
      </span>
    </>
  );
};

export default UserProfileName;
