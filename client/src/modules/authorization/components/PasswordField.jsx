import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const PasswordField = ({ onChange, label, errorId }) => (
  <label
    className={classNames('password-field', {
      'password-field--error': errorId
    })}
  >
    {label}
    <input
      className={classNames('primary-input', {
        'password-field__input--error': errorId
      })}
      type="password"
      onChange={onChange}
    />
    {errorId && <FormattedMessage id={errorId} />}
  </label>
);

PasswordField.propTypes = {
  errorId: PropTypes.string,
  label: PropTypes.string.isRequired,

  onChange: PropTypes.func
};

export default PasswordField;
