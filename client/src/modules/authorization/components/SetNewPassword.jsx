import React, { PureComponent } from 'react';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _trim from 'lodash/trim';

import PendingButton from '../../../common/components/PendingButton';
import SignUpInput from './SignUpInput';

class SetNewPassword extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordConfirmation: '',
      pending: false,
      errors: {
        passwordError: '',
        comparePasswordsError: ''
      }
    };
  }

  handlePasswordChange = value => {
    this.setState({ password: value });
  };

  handlePasswordConfirmationChange = value => {
    this.setState({ passwordConfirmation: value }, this.comparePasswords);
  };

  handleSubmit = () => {
    const { password, passwordConfirmation } = this.state;

    console.log('Submitting: ', password, passwordConfirmation);
  };

  validatePassword = () => {
    const { matches } = validator;
    const { password } = this.state;

    if (!matches(password, /^[^\s]{4,32}$/)) {
      //return 'authorization.input.password.invalid';

      this.setState({
        errors: {
          passwordError: 'authorization.input.password.invalid'
        }
      });
    }

    this.setState({
      errors: {
        passwordError: ''
      }
    });

    // return '';
  };

  comparePasswords = () => {
    const { password, passwordConfirmation } = this.state;

    if (_trim(password) !== _trim(passwordConfirmation)) {
      this.setState({
        errors: {
          comparePasswordsError: 'authorization.input.password.not-match'
        }
      });
    }
  };

  render() {
    const {
      pending,
      errors: { passwordError, comparePasswordsError }
    } = this.state;

    return (
      <form className="set-new-password" onSubmit={this.handleSubmit}>
        <h2 className="set-new-password__heading">Set new password</h2>
        <div className="set-new-password__body">
          <SignUpInput
            disabled={pending}
            externalErrorId={passwordError}
            labelId="authorization.input.password.label"
            name="email"
            onChange={this.handlePasswordChange}
            type="password"
            validator={this.validatePassword}
          />
          <SignUpInput
            disabled={pending}
            externalErrorId={comparePasswordsError}
            labelId="authorization.input.password.confirm"
            name="confirm password"
            onChange={this.handlePasswordConfirmationChange}
            type="password"
          />
          <PendingButton className="primary-button">Save</PendingButton>
        </div>
      </form>
    );
  }
}

SetNewPassword.propTypes = {};

export default connect()(SetNewPassword);
