import React, { Fragment, PureComponent } from 'react';
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
      confirmationSend: false,
      email: '',
      errors: {},
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
    const {
      errors,
      errors: { passwordError },
      password,
      passwordConfirm
    } = this.state;
    let newError;

    if (passwordError && password === passwordConfirm) {
      newError = '';
    }

    if (
      !passwordError &&
      password !== '' &&
      passwordConfirm !== '' &&
      password !== passwordConfirm
    ) {
      newError = 'authorization.input.password.not-same';
    }

    if (newError !== undefined) {
      this.setState({
        errors: {
          ...errors,
          passwordError: newError
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
      .then(() => this.setState({ confirmationSend: true }))
      .catch(err => {
        const { status } = err.response;

        if (status === 406) {
          const { errors } = err.response;
          this.setState({ errors });
        }
      })
      .finally(() => this.setState({ pending: false }));
  };

  renderSignUpForm = () => {
    const {
      errors: { nameError, emailError, passwordError },
      isFormValid,
      pending
    } = this.state;
    const { onCancel } = this.props;

    return (
      <Fragment>
        <h1>
          <FormattedMessage id="authorization.create-account" />
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
            id="confirm"
            onChange={this.onPasswordConfirmChange}
          />
          <button
            className="primary-button"
            type="button"
            disabled={pending}
            onClick={onCancel}
          >
            <FormattedMessage id="common.button.cancel" />
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={pending || !isFormValid}
            onClick={this.handleSignUp}
          >
            <FormattedMessage id="authorization.sign-up" />
          </button>
        </form>
      </Fragment>
    );
  };

  renderConfirmationMessage = () => {
    const { email } = this.state;

    return (
      <p>
        <FormattedMessage
          email={email}
          id="authorization.sign-up.confirmation-link-sent"
        />
      </p>
    );
  };

  render() {
    const { confirmationSend } = this.state;

    return (
      <div>
        {confirmationSend
          ? this.renderConfirmationMessage()
          : this.renderSignUpForm()}
      </div>
    );
  }
}

SignUp.propTypes = {
  onCancel: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired
};

export default connect(
  null,
  { signUp }
)(SignUp);
