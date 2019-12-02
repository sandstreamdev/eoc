import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import _trim from 'lodash/trim';
import isLength from 'validator/lib/isLength';
import isEmpty from 'validator/lib/isEmpty';
import { connect } from 'react-redux';

import './UserProfileName.scss';
import { validateWith } from 'common/utils/helpers';
import { updateName } from 'modules/user/model/actions';

const UserProfileName = props => {
  const { name } = props;
  const [errorMessageId, setErrorMessageId] = useState('');
  const [isFormVisible, setFormVisibility] = useState(false);
  const [currentName, setName] = useState(name);
  const [isNameUpdated, setIsNameUpdated] = useState(false);

  const showForm = () => setFormVisibility(true);

  const hideForm = () => setFormVisibility(false);

  const validateName = () => {
    let errorMessageId;

    errorMessageId = validateWith(
      value => !isEmpty(value, { ignore_whitespace: true })
    )('common.form.required-warning')(currentName);

    if (_trim(currentName)) {
      errorMessageId = validateWith(value =>
        isLength(value, { min: 1, max: 32 })
      )('common.form.field-min-max')(currentName);
    }

    setErrorMessageId(errorMessageId);
  };

  const handleNameUpdate = event => {
    event.preventDefault();
    const { userId, updateName } = props;

    if (isNameUpdated && !errorMessageId) {
      updateName(currentName, userId);

      setErrorMessageId('');
      setIsNameUpdated(false);
      setFormVisibility(false);
    }
  };

  const handleNameChange = event => {
    const {
      target: { value }
    } = event;

    setName(value);
    setIsNameUpdated(true);
  };

  useEffect(() => {
    validateName();
  }, [currentName]);

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
                onSubmit={handleNameUpdate}
              >
                <input
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
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
                  <FormattedMessage id="common.new-comment.save" />
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
  name: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,

  updateName: PropTypes.func.isRequired
};

export default connect(null, { updateName })(UserProfileName);
