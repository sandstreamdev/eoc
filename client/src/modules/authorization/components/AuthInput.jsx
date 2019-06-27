import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import _debounce from 'lodash/debounce';
import _trim from 'lodash/trim';
import _trimStart from 'lodash/trimStart';

import { IntlPropType } from 'common/constants/propTypes';
import { CheckIcon, ErrorIcon } from 'assets/images/icons';

class AuthInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errorMessageId: '',
      invalidTheme: false,
      validTheme: false,
      value: ''
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

  componentDidUpdate(prevProps) {
    const { errorMessageId } = this.state;
    const {
      externalErrorId: prevExternalErrorId,
      formError: prevFormError
    } = prevProps;
    const { externalErrorId, formError } = this.props;

    if (
      prevExternalErrorId !== externalErrorId ||
      prevFormError !== formError
    ) {
      this.setValidationTheme(errorMessageId);
    }
  }

  componentWillUnmount() {
    this.debouncedChange.cancel();
  }

  setValidationTheme = errorMessageId => {
    const { value } = this.state;
    const { externalErrorId, formError } = this.props;

    const isValid = !externalErrorId && !errorMessageId;
    const invalidTheme = !isValid || formError;
    const validTheme = isValid && value && !formError;

    this.setState({ invalidTheme, validTheme });
  };

  handleChange = () => {
    const { value } = this.state;
    const { onChange, validator } = this.props;
    const trimmedValue = _trim(value);
    const errorMessageId = validator ? validator(trimmedValue) : '';

    this.setValidationTheme(errorMessageId);
    this.setState({ errorMessageId });
    onChange(trimmedValue, !errorMessageId);
  };

  handleInputChange = event => {
    const { value } = event.target;

    this.setState({ value: _trimStart(value) }, this.debouncedChange);
  };

  renderFeedback = () => {
    const { errorMessageId } = this.state;
    const {
      externalErrorId,
      intl: { formatMessage }
    } = this.props;

    if (externalErrorId || errorMessageId) {
      const feedbackMessageId = externalErrorId || errorMessageId;

      return (
        <p className="auth-input__feedback">
          <span className="auth-input__icon--invalid">
            <ErrorIcon />
          </span>
          <span className="auth-input__feedback-info--invalid">
            {formatMessage({ id: feedbackMessageId })}
          </span>
        </p>
      );
    }
  };

  render() {
    const {
      disabled,
      focus,
      intl: { formatMessage },
      labelId,
      name,
      type
    } = this.props;
    const { invalidTheme, value, validTheme } = this.state;

    return (
      <div className="auth-input">
        <label
          className={classNames('auth-input__label', {
            'auth-input__label--valid': validTheme,
            'auth-input__label--invalid': invalidTheme
          })}
          htmlFor={name}
        >
          {formatMessage({ id: labelId })}
          {validTheme && (
            <span className="auth-input__icon--valid">
              <CheckIcon />
            </span>
          )}
        </label>
        <input
          className={classNames('primary-input auth-input__input', {
            'auth-input__input--valid': validTheme,
            'auth-input__input--invalid': invalidTheme
          })}
          disabled={disabled}
          id={name}
          name={name}
          onChange={this.handleInputChange}
          ref={focus && this.input}
          type={type}
          value={value}
        />
        {this.renderFeedback()}
      </div>
    );
  }
}

AuthInput.propTypes = {
  disabled: PropTypes.bool,
  externalErrorId: PropTypes.string,
  focus: PropTypes.bool,
  formError: PropTypes.bool,
  intl: IntlPropType.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired,
  validator: PropTypes.func
};

export default injectIntl(AuthInput);
