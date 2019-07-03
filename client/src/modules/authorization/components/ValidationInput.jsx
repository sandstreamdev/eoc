import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CheckIcon } from 'assets/images/icons';

const ValidationInput = ({ onChange, label, errorId, success, type }) => (
  <label
    className={classNames('validation-input', {
      'validation-input--error': errorId,
      'validation-input--success': success
    })}
  >
    {label}
    <input
      className={classNames('primary-input validation-input__input', {
        'validation-input__input--error': errorId
      })}
      type={type}
      onChange={onChange}
    />
    <div className="validation-input__check-icon">
      <CheckIcon />
    </div>
    {errorId && <FormattedMessage id={errorId} />}
  </label>
);

ValidationInput.propTypes = {
  errorId: PropTypes.string,
  label: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,

  onChange: PropTypes.func
};

export default ValidationInput;
