import React, { PureComponent } from 'react';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _trim from 'lodash/trim';
import _debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';

import { RouterMatchPropType } from 'common/constants/propTypes';
import PendingButton from '../../../common/components/PendingButton';
import ValidationInput from './ValidationInput';
import { updatePassword } from '../model/actions';

class PasswordRecoveryForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errors: {
        passwordError: '',
        comparePasswordsError: '',
        passwordUpdateError: false
      },
      password: '',
      passwordConfirmation: '',
      passwordConfirmationSuccess: false,
      passwordSuccess: false,
      pending: false
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
    const { password } = this.state;
    const {
      match: {
        params: { token }
      }
    } = this.props;

    this.setState({ pending: true });
    updatePassword(token, password)
      .then(() => this.setState({ pending: false }))
      .catch(() => {
        const { errors } = this.state;

        this.setState({
          errors: {
            ...errors,
            passwordUpdateError: true
          },
          password: '',
          passwordConfirmation: '',
          passwordConfirmationSuccess: false,
          passwordSuccess: false,
          pending: false
        });
      });
  };

  validatePassword = password => {
    const { matches } = validator;
    const validationError = !matches(password, /^[^\s]{4,32}$/);
    const { passwordConfirmation, errors } = this.state;

    if (passwordConfirmation) {
      this.comparePasswords();
    }

    if (_isEmpty(password)) {
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

    if (
      _isEmpty(password) ||
      _isEmpty(passwordConfirmation) ||
      password.length < 4
    ) {
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
      errors: { passwordError, comparePasswordsError, passwordUpdateError },
      password,
      passwordConfirmation,
      passwordConfirmationSuccess,
      passwordSuccess,
      pending
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
            value={password}
          />
          <ValidationInput
            errorId={comparePasswordsError}
            label="Confirm password"
            onChange={this.handlePasswordConfirmationChange}
            success={passwordConfirmationSuccess}
            type="password"
            value={passwordConfirmation}
          />
          <PendingButton
            className="primary-button"
            disabled={isButtonDisabled}
            onClick={this.handleSubmit}
            pending={pending}
          >
            <FormattedMessage id="common.new-comment.save" />
          </PendingButton>
          {passwordUpdateError && (
            <div className="pass-recovery-form__error">
              <FormattedMessage id="common.something-went-wrong" />
            </div>
          )}
        </div>
      </form>
    );
  }
}

PasswordRecoveryForm.propTypes = {
  match: RouterMatchPropType.isRequired
};

export default _flowRight(withRouter, connect())(PasswordRecoveryForm);
