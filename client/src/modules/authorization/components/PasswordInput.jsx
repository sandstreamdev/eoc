import React, { Fragment, PureComponent } from 'react';
import validator from 'validator';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import _debounce from 'lodash/debounce';

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
    let errorMessageId = '';

    if (isEmpty(value)) {
      errorMessageId = 'authorization.input.password.empty';
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
      <Fragment>
        <span>{isValid ? <CheckIcon /> : <ErrorIcon />}</span>
        <span
          className={classNames({
            'password__feedback--valid': isValid,
            'password__feedback--invalid': !isValid
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
      externalErrorId,
      id,
      intl: { formatMessage },
      label
    } = this.props;
    const { value, wasEdited } = this.state;

    return (
      <Fragment>
        <label htmlFor={id || 'password'}>
          {formatMessage({
            id: label || 'authorization.input.password.label'
          })}
        </label>
        <input
          id={id || 'password'}
          className="form__input primary-input"
          disabled={disabled}
          name={id || 'password'}
          onChange={this.handleInputChange}
          type="password"
          value={value}
        />
        {(externalErrorId || wasEdited) && this.renderFeedback()}
      </Fragment>
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
