import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { CheckIcon } from 'assets/images/icons';
import { PasswordValidationValues } from 'common/constants/enums';

const ValidationInput = ({
  errorId,
  label,
  onChange,
  success,
  type,
  value
}) => (
  <label
    className={classNames('validation-input', {
      'validation-input--error': errorId,
      'validation-input--success': success
    })}
  >
    {label}
    <input
      className="primary-input validation-input__input"
      onChange={onChange}
      type={type}
      value={value}
    />
    <div className="validation-input__check-icon">
      <CheckIcon />
    </div>
    {errorId && (
      <FormattedMessage
        id={errorId}
        values={{
          min: PasswordValidationValues.MIN,
          max: PasswordValidationValues.MAX
        }}
      />
    )}
  </label>
);

ValidationInput.propTypes = {
  errorId: PropTypes.string,
  label: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,

  onChange: PropTypes.func
};

export default ValidationInput;
