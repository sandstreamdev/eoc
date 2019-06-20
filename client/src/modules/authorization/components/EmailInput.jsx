import React, { Fragment, PureComponent } from 'react';
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

    if (!wasEdited) {
      this.setState({ wasEdited: true });
    }

    if (isEmpty(value)) {
      errorMessageId = 'authorization.input.email.empty';
    } else if (!isEmail(value)) {
      errorMessageId = 'authorization.input.email.invalid';
    }

    this.setState({ errorMessageId });
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
      <Fragment>
        <span>{isValid ? <CheckIcon /> : <ErrorIcon />}</span>
        <span
          className={classNames({
            'email__feedback--valid': isValid,
            'email__feedback--invalid': !isValid
          })}
        >
          {formatMessage({ id: feedbackMessageId })}
        </span>
      </Fragment>
    );
  };

  render() {
    const {
      disabled,
      intl: { formatMessage }
    } = this.props;
    const { value, wasEdited } = this.state;

    return (
      <Fragment>
        <label htmlFor="email">
          {formatMessage({
            id: 'authorization.input.email.label'
          })}
        </label>
        <input
          id="email"
          className="form__input primary-input"
          disabled={disabled}
          name="email"
          onChange={this.handleInputChange}
          type="email"
          value={value}
        />
        {wasEdited && this.renderFeedback()}
      </Fragment>
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
