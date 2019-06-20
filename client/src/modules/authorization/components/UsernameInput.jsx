import React, { Fragment, PureComponent } from 'react';
import validator from 'validator';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import _debounce from 'lodash/debounce';

import { IntlPropType } from 'common/constants/propTypes';
import { CheckIcon, ErrorIcon } from 'assets/images/icons';

class UsernameInput extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      errorMessageId: '',
      wasEdited: false
    };

    this.nameInput = React.createRef();
    this.debouncedNameChange = _debounce(this.handleNameChange, 500);
  }

  componentDidMount() {
    this.nameInput.current.focus();
  }

  componentWillUnmount() {
    this.debouncedNameChange.cancel();
  }

  handleNameChange = () => {
    const { value, wasEdited } = this.state;
    const { onChange } = this.props;
    const { isEmpty, isLength } = validator;
    let errorMessageId = '';

    if (isEmpty(value)) {
      errorMessageId = 'authorization.input.username.empty';
    } else if (!isLength(value, { min: 3, max: 32 })) {
      errorMessageId = 'authorization.input.username.invalid';
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

    this.setState({ value }, this.debouncedNameChange);
  };

  renderFeedback = () => {
    const { errorMessageId } = this.state;
    const {
      externalErrorId,
      intl: { formatMessage }
    } = this.props;
    const isValid = !externalErrorId && !errorMessageId;

    const feedbackMessageId = isValid
      ? 'authorization.input.username.valid'
      : externalErrorId || errorMessageId;

    return (
      <Fragment>
        <span>{isValid ? <CheckIcon /> : <ErrorIcon />}</span>
        <span
          className={classNames({
            'username__feedback--valid': isValid,
            'username__feedback--invalid': !isValid
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
      intl: { formatMessage }
    } = this.props;
    const { value, wasEdited } = this.state;

    return (
      <Fragment>
        <label htmlFor="username">
          {formatMessage({
            id: 'authorization.input.username.label'
          })}
        </label>
        <input
          id="username"
          className="form__input primary-input"
          disabled={disabled}
          name="name"
          onChange={this.handleInputChange}
          ref={this.nameInput}
          type="text"
          value={value}
        />
        {(externalErrorId || wasEdited) && this.renderFeedback()}
      </Fragment>
    );
  }
}

UsernameInput.propTypes = {
  disabled: PropTypes.bool,
  externalErrorId: PropTypes.string,
  intl: IntlPropType.isRequired,
  onChange: PropTypes.func.isRequired
};

export default injectIntl(UsernameInput);
