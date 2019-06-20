import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import UsernameInput from './UsernameInput';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import { signUp } from 'modules/authorization/model/actions';

class SignUp extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      errors: { nameError: 'authorization.input.username.invalid' },
      isEmailValid: false,
      isFormValid: false,
      isNameValid: false,
      isPasswordConfirmValid: false,
      isPasswordValid: false,
      name: '',
      password: '',
      passwordConfirm: '',
      pending: false
    };
  }

  componentDidUpdate() {
    this.isFormValid();
  }

  onNameChange = (name, isValid) => {
    this.setState({ name, isNameValid: isValid });
  };

  onEmailChange = (email, isValid) => {
    this.setState({ email, isEmailValid: isValid });
  };

  onPasswordChange = (password, isValid) => {
    this.setState(
      { password, isPasswordValid: isValid },
      this.comparePasswords
    );
  };

  onPasswordConfirmChange = (passwordConfirm, isValid) => {
    this.setState(
      { passwordConfirm, isPasswordConfirmValid: isValid },
      this.comparePasswords
    );
  };

  comparePasswords = () => {
    const { errors, password, passwordConfirm } = this.state;
    if (
      password !== '' &&
      passwordConfirm !== '' &&
      password !== passwordConfirm
    ) {
      this.setState({
        errors: {
          ...errors,
          passwordError: 'authorization.input.password.invalid'
        }
      });
    }
  };

  isFormValid = () => {
    const {
      isNameValid,
      isEmailValid,
      isPasswordValid,
      isPasswordConfirmValid
    } = this.state;

    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPasswordConfirmValid
    ) {
      return this.setState({ isFormValid: true });
    }

    this.setState({ isFormValid: false });
  };

  handleSignUp = () => {
    const { signUp } = this.props;
    const { email, name, password, passwordConfirm } = this.state;

    this.setState({ pending: true });

    signUp(email, name, password, passwordConfirm)
      .catch(err => {
        const { status } = err.response;

        if (status === 406) {
          const { errors } = this.state;
          this.setState({ errors });
        }
      })
      .finally(() => this.setState({ pending: false }));
  };

  render() {
    const {
      errors: { nameError, emailError, passwordError },
      isFormValid,
      pending
    } = this.state;

    return (
      <div>
        <h1>
          <FormattedMessage id="authorization.sign-up" />
        </h1>
        <form autoComplete="off" noValidate>
          <UsernameInput
            disabled={pending}
            externalErrorId={nameError}
            onChange={this.onNameChange}
          />
          <EmailInput
            disabled={pending}
            externalErrorId={emailError}
            onChange={this.onEmailChange}
          />
          <PasswordInput
            disabled={pending}
            externalErrorId={passwordError}
            onChange={this.onPasswordChange}
          />
          <PasswordInput
            disabled={pending}
            externalErrorId={passwordError}
            label="authorization.input.password.confirm"
            onChange={this.onPasswordConfirmChange}
          />
          <button
            className="primary-button"
            type="button"
            disabled={pending || !isFormValid}
            onClick={this.handleSignUp}
          >
            <FormattedMessage id="authorization.sign-up" />
          </button>
        </form>
      </div>
    );
  }
}

SignUp.propTypes = {
  signUp: PropTypes.func.isRequired
};

export default connect(
  null,
  { signUp }
)(SignUp);
