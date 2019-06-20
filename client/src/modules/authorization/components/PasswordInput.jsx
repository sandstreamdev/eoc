import React, { PureComponent } from 'react';
import validator from 'validator';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import _debounce from 'lodash/debounce';
import _trim from 'lodash/trim';

import { IntlPropType } from 'common/constants/propTypes';
import { CheckIcon, ErrorIcon } from 'assets/images/icons';

class PasswordInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      errorMessageId: '',
      wasEdited: false
    };

    this.debouncedPasswordChange = _debounce(this.handlePasswordChange, 500);
  }

  componentWillUnmount() {
    this.debouncedPasswordChange.cancel();
  }

  handlePasswordChange = () => {
    const { value, wasEdited } = this.state;
    const { onChange } = this.props;
    const { isEmpty } = validator;
    const trimmedValue = _trim(value);
    let errorMessageId = '';

    if (isEmpty(trimmedValue)) {
      errorMessageId = 'authorization.input.password.empty';
    }

    const newState = { errorMessageId };

    if (!wasEdited) {
      newState.wasEdited = true;
    }

    this.setState(newState);
    onChange(trimmedValue, !errorMessageId);
  };

  handleInputChange = event => {
    const { value } = event.target;

    this.setState({ value }, this.debouncedPasswordChange);
  };

  renderFeedback = () => {
    const { errorMessageId } = this.state;
    const {
      externalErrorId,
      intl: { formatMessage }
    } = this.props;
    const isValid = !externalErrorId && !errorMessageId;

    const feedbackMessageId = isValid
      ? 'authorization.input.password.valid'
      : externalErrorId || errorMessageId;

    return (
      <p className="Sign-Up__feedback">
        <span
          className={classNames('Sign-Up__feedback-icon', {
            'Sign-Up__feedback-icon--valid': isValid,
            'Sign-Up__feedback-icon--invalid': !isValid
          })}
        >
          {isValid ? <CheckIcon /> : <ErrorIcon />}
        </span>
        <span
          className={classNames('Sign-Up__feedback-info', {
            'Sign-Up__feedback-info--valid': isValid,
            'Sign-Up__feedback-info--invalid': !isValid
          })}
        >
          {formatMessage({ id: feedbackMessageId })}
        </span>
      </p>
    );
  };

  render() {
    const {
      disabled,
      externalErrorId,
      id,
      intl: { formatMessage },
      label
    } = this.props;
    const { errorMessageId, value, wasEdited } = this.state;
    const isValid = !externalErrorId && !errorMessageId;

    return (
      <div className="Sign-Up__input-box">
        <label
          className={classNames('Sign-Up__label', {
            'Sign-Up__label--valid': wasEdited && isValid,
            'Sign-Up__label--invalid': wasEdited && !isValid
          })}
          htmlFor={id || 'password'}
        >
          {formatMessage({
            id: label || 'authorization.input.password.label'
          })}
        </label>
        <input
          id={id || 'password'}
          className={classNames('primary-input Sign-Up__input', {
            'Sign-Up__input--valid': wasEdited && isValid,
            'Sign-Up__input--invalid': wasEdited && !isValid
          })}
          disabled={disabled}
          name={id || 'password'}
          onChange={this.handleInputChange}
          type="password"
          value={value}
        />
        {(externalErrorId || wasEdited) && this.renderFeedback()}
      </div>
    );
  }
}

PasswordInput.propTypes = {
  disabled: PropTypes.bool,
  externalErrorId: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  intl: IntlPropType.isRequired,
  onChange: PropTypes.func.isRequired
};

export default injectIntl(PasswordInput);
