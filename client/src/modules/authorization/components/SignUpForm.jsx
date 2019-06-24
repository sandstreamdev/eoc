import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _find from 'lodash/find';
import validator from 'validator';

import SignUpInput from './SignUpInput';
import { signUp } from 'modules/authorization/model/actions';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import PendingButton from 'common/components/PendingButton';

class SignUpForm extends PureComponent {
  pendingPromise = null;

  constructor(props) {
    super(props);

    this.state = {
      confirmationSend: false,
      email: '',
      higherLevelErrors: {
        emailError: '',
        nameError: '',
        confirmPasswordValueError: '',
        passwordError: ''
      },
      isEmailValid: false,
      isFormValid: false,
      isNameValid: false,
      isPasswordConfirmValid: false,
      isPasswordValid: false,
      name: '',
      password: '',
      confirmPasswordValue: undefined,
      pending: false
    };
  }

  componentDidUpdate() {
    this.isFormValid();
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  onNameChange = (name, isValid) =>
    this.setState({ name, isNameValid: isValid });

  onEmailChange = (email, isValid) =>
    this.setState({ email, isEmailValid: isValid });

  onPasswordChange = (password, isValid) =>
    this.setState(
      { password, isPasswordValid: isValid },
      this.comparePasswords
    );

  onPasswordConfirmChange = (confirmPasswordValue, isValid) =>
    this.setState(
      { confirmPasswordValue, isPasswordConfirmValid: isValid },
      this.comparePasswords
    );

  nameValidator = value => {
    const { isEmpty, isLength } = validator;

    if (isEmpty(value)) {
      return 'authorization.input.username.empty';
    }

    if (!isLength(value, { min: 1, max: 32 })) {
      return 'authorization.input.username.invalid';
    }

    return '';
  };

  emailValidator = value => {
    const { isEmail } = validator;

    if (!isEmail(value)) {
      return 'authorization.input.email.invalid';
    }

    return '';
  };

  passwordValidator = value => {
    const { matches } = validator;

    if (!matches(value, /^[^\s]{4,32}$/)) {
      return 'authorization.input.password.invalid';
    }

    return '';
  };

  comparePasswords = () => {
    const {
      higherLevelErrors,
      higherLevelErrors: { confirmPasswordValueError },
      password,
      confirmPasswordValue
    } = this.state;
    let newError;

    if (confirmPasswordValueError && password === confirmPasswordValue) {
      newError = '';
    }

    if (
      !confirmPasswordValueError &&
      confirmPasswordValue !== undefined &&
      password !== confirmPasswordValue
    ) {
      newError = 'authorization.input.password.not-match';
    }

    if (newError !== undefined) {
      this.setState({
        higherLevelErrors: {
          ...higherLevelErrors,
          confirmPasswordValueError: newError
        }
      });
    }
  };

  isFormValid = () => {
    const {
      higherLevelErrors,
      isEmailValid,
      isNameValid,
      isPasswordConfirmValid,
      isPasswordValid
    } = this.state;
    const isError = _find(higherLevelErrors, error => error !== '');

    return this.setState({
      isFormValid:
        isNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isPasswordConfirmValid &&
        !isError
    });
  };

  handleSignUp = () => {
    const { signUp } = this.props;
    const { email, name, password, confirmPasswordValue } = this.state;

    this.setState({ pending: true });

    this.pendingPromise = makeAbortablePromise(
      signUp(email, name, password, confirmPasswordValue)
    );

    return this.pendingPromise.promise
      .then(() => this.setState({ confirmationSend: true, pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          const { status } = err.response;
          const newState = { pending: false };

          if (status === 406) {
            const { errors } = err.response;
            newState.higherLevelErrors = errors;
          }

          this.setState(newState);
        }
      });
  };

  renderSignUpForm = () => {
    const {
      higherLevelErrors: {
        nameError,
        emailError,
        confirmPasswordValueError,
        passwordError
      },
      isFormValid,
      pending
    } = this.state;
    const { onCancel } = this.props;

    return (
      <Fragment>
        <h1 className="sign-up-form__heading">
          <FormattedMessage id="authorization.create-account" />
        </h1>
        <form className="sign-up-form__form" noValidate>
          <SignUpInput
            disabled={pending}
            externalErrorId={nameError}
            focus
            labelId="authorization.input.username.label"
            name="name"
            onChange={this.onNameChange}
            type="text"
            validator={this.nameValidator}
          />
          <SignUpInput
            disabled={pending}
            externalErrorId={emailError}
            labelId="authorization.input.email.label"
            name="email"
            onChange={this.onEmailChange}
            type="text"
            validator={this.emailValidator}
          />
          <SignUpInput
            disabled={pending}
            externalErrorId={passwordError}
            labelId="authorization.input.password.label"
            name="password"
            onChange={this.onPasswordChange}
            type="password"
            validator={this.passwordValidator}
          />
          <SignUpInput
            disabled={pending}
            externalErrorId={confirmPasswordValueError}
            labelId="authorization.input.password.confirm"
            name="confirm"
            onChange={this.onPasswordConfirmChange}
            type="password"
          />
          <div className="sign-up-form__buttons">
            <button
              className="primary-button"
              type="button"
              disabled={pending}
              onClick={onCancel}
            >
              <FormattedMessage id="common.button.cancel" />
            </button>
            <PendingButton
              className="primary-button sign-up-form__confirm"
              type="button"
              disabled={!isFormValid}
              onClick={this.handleSignUp}
            >
              <FormattedMessage id="authorization.sign-up" />
            </PendingButton>
          </div>
        </form>
      </Fragment>
    );
  };

  renderConfirmationMessage = () => {
    const { email } = this.state;

    return (
      <p className="sign-up-form__confirmation">
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
      <div className="sign-up">
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
