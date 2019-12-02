import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ErrorIcon } from 'assets/images/icons';
import './AuthCheckbox.scss';

const AuthCheckbox = ({
  checked,
  disabled,
  errorMessage,
  label,
  name,
  onChange,
  value
}) => (
  <div className="auth-checkbox">
    <label className="auth-checkbox__label">
      <input
        checked={checked}
        className={classNames('auth-checkbox__input', {
          'auth-checkbox__input--invalid': errorMessage
        })}
        disabled={disabled}
        id={name}
        name={name}
        onChange={onChange}
        type="checkbox"
        value={value}
      />
      <p>{label}</p>
    </label>
    {errorMessage && (
      <p className="auth-checkbox__feedback">
        <span className="auth-checkbox__icon">
          <ErrorIcon />
        </span>
        {errorMessage}
      </p>
    )}
  </div>
);

AuthCheckbox.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.node,
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired
};

export default AuthCheckbox;
