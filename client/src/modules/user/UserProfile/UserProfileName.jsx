import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _trim from 'lodash/trim';
import classNames from 'classnames';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import PropTypes from 'prop-types';

import './UserProfileName.scss';
import { validateWith } from 'common/utils/helpers';
import { updateName } from 'modules/user/model/actions';

const UserProfileName = props => {
  const { name } = props;
  const [errorMessageId, setErrorMessageId] = useState('');
  const [isFormVisible, setFormVisibility] = useState(false);
  const [currentName, setName] = useState(name);
  const [isDirty, setIsDirty] = useState(false);
  const nameRef = useRef();
  const inputRef = useRef();

  const showForm = () => setFormVisibility(true);

  const hideForm = () => setFormVisibility(false);

  const validateName = useCallback(() => {
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
  }, [currentName]);

  const handleNameUpdate = useCallback(
    async event => {
      event.preventDefault();

      const { userId, updateName } = props;
      const canBeUpdated = isDirty && !errorMessageId && isFormVisible;
      const canBeHidden = !isDirty && !errorMessageId && isFormVisible;

      try {
        if (canBeUpdated) {
          await updateName(currentName, userId);
          setErrorMessageId('');
          setIsDirty(false);
          hideForm();
        }

        if (canBeHidden) {
          hideForm();
        }
      } catch (error) {
        setErrorMessageId('common.something-went-wrong');
      }
    },
    [currentName, errorMessageId, isDirty, isFormVisible, props]
  );

  const handleNameChange = event => {
    const {
      target: { value }
    } = event;

    setName(value);
    setIsDirty(true);
  };

  useEffect(() => {
    validateName();
  }, [currentName, validateName]);

  useEffect(() => {
    const handleClickOutside = event => {
      const { target } = event;
      const clickedOutsideSpan = !nameRef.current.contains(target);
      const clickedOutsideInput = !inputRef.current.contains(target);

      if (clickedOutsideInput && clickedOutsideSpan) {
        handleNameUpdate(event);
      }
    };

    if (isFormVisible) {
      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [inputRef, isFormVisible, handleNameUpdate, nameRef]);

  useEffect(() => {
    if (isFormVisible) {
      inputRef.current.focus();
    }
  }, [inputRef, isFormVisible]);

  return (
    <>
      <span className="user-profile-name__data-name">
        <FormattedMessage id="user.name" />
      </span>
      <span className="user-profile-name__data-name-wrapper">
        <span className="user-profile-name__data-value">
          <form
            className={classNames('user-profile-name__name-form', {
              'user-profile-name__name-form--hidden': !isFormVisible
            })}
            onSubmit={handleNameUpdate}
          >
            <input
              className="primary-input"
              onChange={handleNameChange}
              ref={inputRef}
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
          <span
            className={classNames('user-profile-name__name', {
              'user-profile-name__name--hidden': isFormVisible
            })}
            onClick={isFormVisible ? hideForm : showForm}
            ref={nameRef}
          >
            {currentName}
          </span>
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
