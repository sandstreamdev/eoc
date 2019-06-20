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

  componentDidMount() {
    const { externalErrorId } = this.props;
    this.setState({ errorMessageId: externalErrorId });
  }

  componentDidUpdate(prevProps) {
    const { externalErrorId: prevExternalErrorId } = prevProps;
    const { externalErrorId } = this.props;

    this.checkExternalError(prevExternalErrorId, externalErrorId);
  }

  componentWillUnmount() {
    this.debouncedPasswordChange.cancel();
  }

  handlePasswordChange = () => {
    const { value, wasEdited } = this.state;
    const { onChange } = this.props;
    const { isEmpty } = validator;
    let errorMessageId = '';

    if (!wasEdited) {
      this.setState({ wasEdited: true });
    }

    if (isEmpty(value)) {
      errorMessageId = 'authorization.input.password.empty';
    }

    this.setState({ errorMessageId });
    onChange(value, !errorMessageId);
  };

  handleInputChange = event => {
    const { value } = event.target;

    this.setState({ value }, this.debouncedPasswordChange);
  };

  checkExternalError = (prevExternalErrorId, externalErrorId) => {
    if (!prevExternalErrorId && externalErrorId) {
      this.setState({ errorMessageId: externalErrorId });
    }
  };

  renderFeedback = () => {
    const { errorMessageId } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;
    const isValid = !errorMessageId;

    const feedbackMessageId = isValid
      ? 'authorization.input.password.valid'
      : errorMessageId;

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
      intl: { formatMessage },
      label
    } = this.props;
    const { errorMessageId, value, wasEdited } = this.state;

    return (
      <Fragment>
        <label htmlFor="password">
          {formatMessage({
            id: label || 'authorization.input.password.label'
          })}
        </label>
        <input
          id="password"
          className="form__input primary-input"
          disabled={disabled}
          name="password"
          onChange={this.handleInputChange}
          type="password"
          value={value}
        />
        {(errorMessageId || wasEdited) && this.renderFeedback()}
      </Fragment>
    );
  }
}

PasswordInput.propTypes = {
  disabled: PropTypes.bool,
  externalErrorId: PropTypes.string,
  label: PropTypes.string,
  intl: IntlPropType.isRequired,
  onChange: PropTypes.func.isRequired
};

export default injectIntl(PasswordInput);
