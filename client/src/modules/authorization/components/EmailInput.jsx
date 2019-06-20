import React, { PureComponent } from 'react';
import validator from 'validator';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import _debounce from 'lodash/debounce';

import { IntlPropType } from 'common/constants/propTypes';
import { CheckIcon, ErrorIcon } from 'assets/images/icons';

class EmailInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      errorMessageId: '',
      wasEdited: false
    };

    this.debouncedEmailChange = _debounce(this.handleEmailChange, 500);
  }

  componentWillUnmount() {
    this.debouncedEmailChange.cancel();
  }

  handleEmailChange = () => {
    const { value, wasEdited } = this.state;
    const { onChange } = this.props;
    const { isEmpty, isEmail } = validator;
    let errorMessageId = '';

    if (isEmpty(value)) {
      errorMessageId = 'authorization.input.email.empty';
    } else if (!isEmail(value)) {
      errorMessageId = 'authorization.input.email.invalid';
    }

    const newState = { errorMessageId };

    if (!wasEdited) {
      newState.wasEdited = true;
    }

    this.setState(newState);
    onChange(value, !errorMessageId);
  };

  handleInputChange = event => {
    const { value } = event.target;

    this.setState({ value }, this.debouncedEmailChange);
  };

  renderFeedback = () => {
    const { errorMessageId } = this.state;
    const {
      externalErrorId,
      intl: { formatMessage }
    } = this.props;
    const isValid = !externalErrorId && !errorMessageId;

    const feedbackMessageId = isValid
      ? 'authorization.input.email.valid'
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
      intl: { formatMessage }
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
          htmlFor="email"
        >
          {formatMessage({
            id: 'authorization.input.email.label'
          })}
        </label>
        <input
          id="email"
          className={classNames('primary-input Sign-Up__input', {
            'Sign-Up__input--valid': wasEdited && isValid,
            'Sign-Up__input--invalid': wasEdited && !isValid
          })}
          disabled={disabled}
          name="email"
          onChange={this.handleInputChange}
          type="email"
          value={value}
        />
        {(externalErrorId || wasEdited) && this.renderFeedback()}
      </div>
    );
  }
}

EmailInput.propTypes = {
  disabled: PropTypes.bool,
  externalErrorId: PropTypes.string,
  intl: IntlPropType.isRequired,
  onChange: PropTypes.func.isRequired
};

export default injectIntl(EmailInput);
