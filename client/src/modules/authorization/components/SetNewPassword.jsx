import React, { PureComponent } from 'react';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _trim from 'lodash/trim';

import PendingButton from '../../../common/components/PendingButton';
import ValidationInput from './ValidationInput';

class SetNewPassword extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordSuccess: false,
      passwordConfirmation: '',
      passwordConfirmationSuccess: false,
      pending: false,
      passwordError: '',
      comparePasswordsError: ''
    };
  }

  handlePasswordChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ password: value }, () => this.validatePassword(value));
  };

  handlePasswordConfirmationChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ passwordConfirmation: value }, () =>
      this.comparePasswords()
    );
  };

  handleSubmit = () => {
    const { password, passwordConfirmation } = this.state;

    console.log('Submitting: ', password, passwordConfirmation);
  };

  validatePassword = password => {
    const { matches } = validator;
    const validationError = !matches(password, /^[^\s]{4,32}$/);
    const { passwordConfirmation } = this.state;

    if (passwordConfirmation) {
      this.comparePasswords();
    }

    if (!password) {
      return this.setState({
        passwordError: '',
        passwordSuccess: false
      });
    }

    if (validationError) {
      return this.setState({
        passwordError: 'authorization.input.password.invalid',
        passwordSuccess: false
      });
    }

    if (password.length >= 4) {
      this.setState({
        passwordError: '',
        passwordSuccess: true
      });
    }
  };

  comparePasswords = () => {
    const { password, passwordConfirmation } = this.state;

    if (!password || !passwordConfirmation || password.length < 4) {
      return this.setState({
        comparePasswordsError: '',
        passwordConfirmationSuccess: false
      });
    }

    if (_trim(password) !== _trim(passwordConfirmation)) {
      return this.setState({
        comparePasswordsError: 'authorization.input.password.not-match',
        passwordConfirmationSuccess: false
      });
    }

    if (password.length >= 4) {
      this.setState({
        comparePasswordsError: '',
        passwordConfirmationSuccess: true
      });
    }
  };

  render() {
    const {
      passwordError,
      comparePasswordsError,
      passwordSuccess,
      passwordConfirmationSuccess
    } = this.state;
    const isButtonDisabled = !passwordSuccess || !passwordConfirmationSuccess;

    return (
      <form className="set-new-password" onSubmit={this.handleSubmit}>
        <h2 className="set-new-password__heading">Set new password</h2>
        <div className="set-new-password__body">
          <ValidationInput
            onChange={this.handlePasswordChange}
            label="Password"
            errorId={passwordError}
            success={passwordSuccess}
            type="password"
          />
          <ValidationInput
            label="Confirm password"
            onChange={this.handlePasswordConfirmationChange}
            errorId={comparePasswordsError}
            success={passwordConfirmationSuccess}
            type="password"
          />
          <PendingButton className="primary-button" disabled={isButtonDisabled}>
            Save
          </PendingButton>
        </div>
      </form>
    );
  }
}

SetNewPassword.propTypes = {};

export default connect()(SetNewPassword);
