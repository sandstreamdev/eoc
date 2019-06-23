import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import _debounce from 'lodash/debounce';
import _trim from 'lodash/trim';
import _trimStart from 'lodash/trimStart';

import { IntlPropType } from 'common/constants/propTypes';
import { CheckIcon, ErrorIcon } from 'assets/images/icons';

class SignUpInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errorMessageId: '',
      invalidView: false,
      validView: false,
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
    const { externalErrorId: prevExternalErrorId } = prevProps;
    const { externalErrorId } = this.props;

    if (prevExternalErrorId !== externalErrorId) {
      this.setValidationView(errorMessageId);
    }
  }

  componentWillUnmount() {
    this.debouncedChange.cancel();
  }

  setValidationView = errorMessageId => {
    const { value } = this.state;
    const { externalErrorId } = this.props;

    const isValid = !externalErrorId && !errorMessageId;
    const invalidView = !isValid;
    const validView = isValid && value;
    this.setState({ invalidView, validView });
  };

  handleChange = () => {
    const { value } = this.state;
    const { onChange, validator } = this.props;

    const trimmedValue = _trim(value);
    const errorMessageId = validator ? validator(trimmedValue) : '';

    this.setValidationView(errorMessageId);

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
        <p className="Sign-Up-Input__feedback">
          <span className="Sign-Up-Input__icon--invalid">
            <ErrorIcon />
          </span>
          <span className="Sign-Up-Input__feedback-info--invalid">
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
    const { invalidView, value, validView } = this.state;

    return (
      <div className="Sign-Up-Input">
        <label
          className={classNames('Sign-Up-Input__label', {
            'Sign-Up-Input__label--valid': validView,
            'Sign-Up-Input__label--invalid': invalidView
          })}
          htmlFor={name}
        >
          {formatMessage({ id: labelId })}
          {validView && (
            <span className="Sign-Up-Input__icon--valid">
              <CheckIcon />
            </span>
          )}
        </label>
        <input
          id={name}
          className={classNames('primary-input Sign-Up-Input__input', {
            'Sign-Up-Input__input--valid': validView,
            'Sign-Up-Input__input--invalid': invalidView
          })}
          disabled={disabled}
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

SignUpInput.propTypes = {
  disabled: PropTypes.bool,
  externalErrorId: PropTypes.string,
  focus: PropTypes.bool,
  intl: IntlPropType.isRequired,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired,
  validator: PropTypes.func
};

export default injectIntl(SignUpInput);
