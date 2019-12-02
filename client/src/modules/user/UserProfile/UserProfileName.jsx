import React, { useState } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { CheckIcon } from 'assets/images/icons';
import './UserProfileName.scss';

const UserProfileName = props => {
  const { name } = props;
  const [errorMessageId, setErrorMessageId] = useState('');
  const [isFormVisible, setFormVisbility] = useState(false);
  const [currentName, setName] = useState(name);

  const showForm = () => setFormVisbility(true);

  const hideForm = () => setFormVisbility(false);

  const handleNameChange = event => {
    const {
      target: { value }
    } = event;

    console.log(value);

    setName(value);
  };

  return (
    <>
      <span className="user-profile-name__data-name">
        <FormattedMessage id="user.name" />
      </span>
      <span className="user-profile-name__data-name-wrapper">
        <span className="user-profile-name__data-value">
          {isFormVisible ? (
            <>
              <form
                className="user-profile-name__name-form"
                onSubmit={() => {}}
              >
                <input
                  className="primary-input"
                  onChange={handleNameChange}
                  type="text"
                  value={currentName}
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
            </>
          ) : (
            <span
              className="user-profile-name__name"
              onClick={isFormVisible ? hideForm : showForm}
            >
              {currentName}
            </span>
          )}
        </span>
      </span>
    </>
  );
};

UserProfileName.propTypes = {
  name: PropTypes.string.isRequired
};

export default UserProfileName;
