import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _find from 'lodash/find';
import validator from 'validator';

import SignUpInput from './SignUpInput';
import { signUp } from 'modules/authorization/model/actions';

class SignUpForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      confirmationSend: false,
      email: '',
      errors: { nameError: '', emailError: '', passwordError: '' },
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

  nameValidator = value => {
    const emptyInfoId = 'authorization.input.username.empty';
    const errorInfoId = 'authorization.input.username.invalid';
    const { isEmpty, isLength } = validator;

    if (isEmpty(value)) {
      return emptyInfoId;
    }

    if (!isLength(value, { min: 1, max: 32 })) {
      return errorInfoId;
    }

    return '';
  };

  emailValidator = value => {
    const emptyInfoId = 'authorization.input.email.empty';
    const errorInfoId = 'authorization.input.email.invalid';
    const { isEmpty, isEmail } = validator;

    if (isEmpty(value)) {
      return emptyInfoId;
    }

    if (!isEmail(value)) {
      return errorInfoId;
    }

    return '';
  };

  passwordValidator = value => {
    const emptyInfoId = 'authorization.input.password.empty';
    const errorInfoId = 'authorization.input.password.invalid';
    const { isEmpty, isLength } = validator;

    if (isEmpty(value)) {
      return emptyInfoId;
    }

    if (!isLength(value, { min: 4 })) {
      return errorInfoId;
    }

    return '';
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
      errors,
      isEmailValid,
      isNameValid,
      isPasswordConfirmValid,
      isPasswordValid
    } = this.state;

    const isError = _find(errors, error => error !== '');

    if (
      isNameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPasswordConfirmValid &&
      !isError
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
        <h1 className="Sign-Up-Form__heading">
          <FormattedMessage id="authorization.create-account" />
        </h1>
        <form autoComplete="off" className="Sign-Up-Form__form" noValidate>
          <SignUpInput
            disabled={pending}
            externalErrorId={nameError}
            focus
            labelId="authorization.input.username.label"
            name="name"
            onChange={this.onNameChange}
            successInfoId="authorization.input.username.valid"
            type="text"
            validator={this.nameValidator}
          />
          <SignUpInput
            disabled={pending}
            externalErrorId={emailError}
            labelId="authorization.input.email.label"
            name="email"
            onChange={this.onEmailChange}
            successInfoId="authorization.input.email.valid"
            type="text"
            validator={this.emailValidator}
          />
          <SignUpInput
            disabled={pending}
            externalErrorId={passwordError}
            labelId="authorization.input.password.label"
            name="password"
            onChange={this.onPasswordChange}
            successInfoId="authorization.input.password.valid"
            type="password"
            validator={this.passwordValidator}
          />
          <SignUpInput
            disabled={pending}
            externalErrorId={passwordError}
            labelId="authorization.input.password.confirm"
            name="confirm"
            onChange={this.onPasswordConfirmChange}
            successInfoId="authorization.input.password.valid"
            type="password"
            validator={this.passwordValidator}
          />
          <div className="Sign-Up-Form__buttons">
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
          </div>
        </form>
      </Fragment>
    );
  };

  renderConfirmationMessage = () => {
    const { email } = this.state;

    return (
      <p className="Sign-Up-Form__confirmation">
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
      <div className="Sign-Up">
        {confirmationSend
          ? this.renderConfirmationMessage()
          : this.renderSignUpForm()}
      </div>
    );
  }
}

SignUpForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired
};

export default connect(
  null,
  { signUp }
)(SignUpForm);
