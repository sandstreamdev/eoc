import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import _debounce from 'lodash/debounce';
import _trim from 'lodash/trim';

import { IntlPropType } from 'common/constants/propTypes';
import { CheckIcon, ErrorIcon } from 'assets/images/icons';

class SignUpInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      errorMessageId: '',
      wasEdited: false
    };

    const { focus } = props;
    if (focus) {
      this.input = React.createRef();
    }
    this.debouncedChange = _debounce(this.handleChange, 500);
  }

  componentDidMount() {
    const { focus } = this.props;
    if (focus) {
      this.input.current.focus();
    }
  }

  componentWillUnmount() {
    this.debouncedChange.cancel();
  }

  handleChange = () => {
    const { value, wasEdited } = this.state;
    const { onChange, validator } = this.props;
    const trimmedValue = _trim(value);
    const errorMessageId = validator(trimmedValue);

    const newState = { errorMessageId };

    if (!wasEdited) {
      newState.wasEdited = true;
    }

    this.setState(newState);
    onChange(trimmedValue, !errorMessageId);
  };

  handleInputChange = event => {
    const { value } = event.target;

    this.setState({ value }, this.debouncedChange);
  };

  renderFeedback = () => {
    const { errorMessageId } = this.state;
    const {
      externalErrorId,
      intl: { formatMessage },
      successInfoId
    } = this.props;
    const isValid = !externalErrorId && !errorMessageId;

    const feedbackMessageId = isValid
      ? successInfoId
      : externalErrorId || errorMessageId;

    return (
      <p className="Sign-Up-Input__feedback">
        <span
          className={classNames('Sign-Up-Input__feedback-icon', {
            'Sign-Up-Input__feedback-icon--valid': isValid,
            'Sign-Up-Input__feedback-icon--invalid': !isValid
          })}
        >
          {isValid ? <CheckIcon /> : <ErrorIcon />}
        </span>
        <span
          className={classNames('Sign-Up-Input__feedback-info', {
            'Sign-Up-Input__feedback-info--valid': isValid,
            'Sign-Up-Input__feedback-info--invalid': !isValid
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
      focus,
      intl: { formatMessage },
      labelId,
      name,
      type
    } = this.props;
    const { errorMessageId, value, wasEdited } = this.state;
    const isValid = !externalErrorId && !errorMessageId;

    return (
      <div className="Sign-Up-Input">
        <label
          className={classNames('Sign-Up-Input__label', {
            'Sign-Up-Input__label--valid': wasEdited && isValid,
            'Sign-Up-Input__label--invalid': wasEdited && !isValid
          })}
          htmlFor={name}
        >
          {formatMessage({ id: labelId })}
        </label>
        <input
          id={name}
          className={classNames('primary-input Sign-Up-Input__input', {
            'Sign-Up-Input__input--valid': wasEdited && isValid,
            'Sign-Up-Input__input--invalid': wasEdited && !isValid
          })}
          disabled={disabled}
          name={name}
          onChange={this.handleInputChange}
          ref={focus && this.input}
          type={type}
          value={value}
        />
        {(externalErrorId || wasEdited) && this.renderFeedback()}
      </div>
    );
  }
}

SignUpInput.propTypes = {
  disabled: PropTypes.bool,
  externalErrorId: PropTypes.string,
  focus: PropTypes.bool,
  intl: IntlPropType.isRequired,
  labelId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  successInfoId: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired,
  validator: PropTypes.func.isRequired
};

export default injectIntl(SignUpInput);
