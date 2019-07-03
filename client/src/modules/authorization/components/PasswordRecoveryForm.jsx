import React, { PureComponent } from 'react';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _trim from 'lodash/trim';
import _debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';

import { RouterMatchPropType } from 'common/constants/propTypes';
import PendingButton from '../../../common/components/PendingButton';
import ValidationInput from './ValidationInput';

class PasswordRecoveryForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordSuccess: false,
      passwordConfirmation: '',
      passwordConfirmationSuccess: false,
      pending: false,
      errors: {
        passwordError: '',
        comparePasswordsError: ''
      }
    };

    this.debouncedChange = undefined;
  }

  handlePasswordChange = event => {
    const {
      target: { value }
    } = event;
    this.debouncedChange = _debounce(() => this.validatePassword(value), 500);

    this.setState({ password: value }, this.debouncedChange);
  };

  handlePasswordConfirmationChange = event => {
    const {
      target: { value }
    } = event;
    this.debouncedChange = _debounce(() => this.comparePasswords(), 500);

    this.setState({ passwordConfirmation: value }, this.debouncedChange);
  };

  handleSubmit = () => {
    const { password, passwordConfirmation } = this.state;
    const {
      match: {
        params: { token }
      }
    } = this.props;

    console.log(token);
    console.log('Submitting: ', password, passwordConfirmation);
  };

  validatePassword = password => {
    const { matches } = validator;
    const validationError = !matches(password, /^[^\s]{4,32}$/);
    const { passwordConfirmation, errors } = this.state;

    if (passwordConfirmation) {
      this.comparePasswords();
    }

    if (!password) {
      return this.setState({
        errors: {
          ...errors,
          passwordError: '',
          comparePasswordsError: ''
        },
        passwordSuccess: false
      });
    }

    if (validationError) {
      return this.setState({
        errors: {
          ...errors,
          passwordError: 'authorization.input.password.invalid'
        },
        passwordSuccess: false
      });
    }

    if (password.length >= 4) {
      this.setState({
        errors: {
          ...errors,
          passwordError: ''
        },
        passwordSuccess: true
      });
    }
  };

  comparePasswords = () => {
    const { password, passwordConfirmation, errors } = this.state;

    if (!password || !passwordConfirmation || password.length < 4) {
      return this.setState({
        errors: {
          ...errors,
          comparePasswordsError: ''
        },
        passwordConfirmationSuccess: false
      });
    }

    if (_trim(password) !== _trim(passwordConfirmation)) {
      return this.setState({
        errors: {
          ...errors,
          comparePasswordsError: 'authorization.input.password.not-match'
        },
        passwordConfirmationSuccess: false
      });
    }

    if (password.length >= 4) {
      this.setState({
        errors: {
          ...errors,
          comparePasswordsError: ''
        },
        passwordConfirmationSuccess: true
      });
    }
  };

  render() {
    const {
      errors: { passwordError, comparePasswordsError },
      passwordSuccess,
      passwordConfirmationSuccess
    } = this.state;
    const isButtonDisabled = !passwordSuccess || !passwordConfirmationSuccess;

    return (
      <form className="pass-recovery-form" onSubmit={this.handleSubmit}>
        <h2 className="pass-recovery-form__heading">Set new password</h2>
        <div className="pass-recovery-form__body">
          <ValidationInput
            errorId={passwordError}
            label="Password"
            onChange={this.handlePasswordChange}
            success={passwordSuccess}
            type="password"
          />
          <ValidationInput
            errorId={comparePasswordsError}
            label="Confirm password"
            onChange={this.handlePasswordConfirmationChange}
            success={passwordConfirmationSuccess}
            type="password"
          />
          <PendingButton
            className="primary-button"
            disabled={isButtonDisabled}
            onClick={this.handleSubmit}
          >
            Save
          </PendingButton>
        </div>
      </form>
    );
  }
}

PasswordRecoveryForm.propTypes = {
  match: RouterMatchPropType.isRequired
};

export default _flowRight(withRouter, connect())(PasswordRecoveryForm);
