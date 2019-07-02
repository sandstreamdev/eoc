import React, { PureComponent } from 'react';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _trim from 'lodash/trim';

import PendingButton from '../../../common/components/PendingButton';
import PasswordField from './PasswordField';

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

  // componentDidUpdate() {
  //   const { password } = this.state;

  //   if (password.length > 0) {
  //     this.validatePassword();
  //   }
  // }

  handlePasswordChange = event => {
    const {
      target: { value }
    } = event;
    const { matches } = validator;
    const password = value;
    const validationError = !matches(password, /^[^\s]{4,32}$/);

    if (validationError) {
      return this.setState({
        errors: {
          passwordError: 'authorization.input.password.invalid'
        }
      });
    }

    if (password.length >= 4) {
      this.setState({
        errors: {
          passwordError: ''
        }
      });
    }
  };

  handlePasswordConfirmationChange = value => {
    this.setState({ passwordConfirmation: value }, this.comparePasswords);
  };

  handleSubmit = () => {
    const { password, passwordConfirmation } = this.state;

    console.log('Submitting: ', password, passwordConfirmation);
  };

  // validatePassword = () => {
  //   const { matches } = validator;
  //   const { password } = this.state;

  //   if (!matches(password, /^[^\s]{4,32}$/)) {
  //     this.setState({
  //       errors: {
  //         passwordError: 'authorization.input.password.invalid'
  //       }
  //     });

  //     return 'authorization.input.password.invalid';
  //     // debugger;
  //   }

  //   this.setState({
  //     errors: {
  //       passwordError: ''
  //     }
  //   });

  //   return '';
  // };

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
          <PasswordField
            onChange={this.handlePasswordChange}
            label="Password"
            errorId={passwordError}
          />
          <PasswordField
            label="Confirm password"
            errorId={comparePasswordsError}
          />
          <PendingButton className="primary-button">Save</PendingButton>
        </div>
      </form>
    );
  }
}

SetNewPassword.propTypes = {};

export default connect()(SetNewPassword);
