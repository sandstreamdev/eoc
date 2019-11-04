import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import _some from 'lodash/some';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import { Link } from 'react-router-dom';

import AuthInput from './AuthInput';
import { signUp } from 'modules/user/model/actions';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import {
  makeAbortablePromise,
  validatePassword,
  validateWith
} from 'common/utils/helpers';
import PendingButton from 'common/components/PendingButton';
import { IntlPropType } from 'common/constants/propTypes';
import { ValidationException } from 'common/exceptions/ValidationException';
import './SignUpForm.scss';

class SignUpForm extends PureComponent {
  pendingPromise = null;

  constructor(props) {
    super(props);

    this.state = {
      confirmationSend: false,
      confirmPasswordValue: undefined,
      email: '',
      higherLevelErrors: {
        confirmPasswordValueError: '',
        emailError: '',
        nameError: '',
        passwordError: ''
      },
      isEmailValid: false,
      isFormValid: false,
      isNameValid: false,
      isPasswordConfirmValid: false,
      isPasswordValid: false,
      name: '',
      password: '',
      pending: false,
      signUpErrorId: ''
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

  onNameChange = (name, isValid) => {
    const {
      higherLevelErrors,
      higherLevelErrors: { nameError }
    } = this.state;
    const error = isValid ? '' : nameError;

    this.setState({
      higherLevelErrors: {
        ...higherLevelErrors,
        nameError: error
      },
      name,
      isNameValid: isValid
    });
  };

  onEmailChange = (email, isValid) => {
    const {
      higherLevelErrors,
      higherLevelErrors: { emailError }
    } = this.state;
    const error = isValid ? '' : emailError;

    this.setState({
      higherLevelErrors: {
        ...higherLevelErrors,
        emailError: error
      },
      email,
      isEmailValid: isValid
    });
  };

  onPasswordChange = (password, isValid) => {
    const {
      higherLevelErrors,
      higherLevelErrors: { passwordError }
    } = this.state;
    const error = isValid ? '' : passwordError;

    this.setState(
      {
        higherLevelErrors: {
          ...higherLevelErrors,
          passwordError: error
        },
        password,
        isPasswordValid: isValid
      },
      this.comparePasswords
    );
  };

  onPasswordConfirmChange = (confirmPasswordValue, isValid) =>
    this.setState(
      { confirmPasswordValue, isPasswordConfirmValid: isValid },
      this.comparePasswords
    );

  nameValidator = value =>
    validateWith(value => isLength(value, { min: 1, max: 32 }))(
      'user.auth.input.email.invalid'
    )(value);

  emailValidator = value =>
    validateWith(value => isEmail(value))('user.auth.input.email.invalid')(
      value
    );

  passwordValidator = value =>
    validateWith(value => validatePassword(value))(
      'user.auth.input.password.invalid'
    )(value);

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
      newError = 'user.auth.input.password.not-match';
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
    const isError = _some(higherLevelErrors, error => error !== '');

    return this.setState({
      isFormValid:
        isNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isPasswordConfirmValid &&
        !isError
    });
  };

  handleSignUp = event => {
    event.preventDefault();
    const { email, name, password, confirmPasswordValue } = this.state;

    this.setState({ pending: true });

    this.pendingPromise = makeAbortablePromise(
      signUp(email, name, password, confirmPasswordValue)
    );

    return this.pendingPromise.promise
      .then(() => this.setState({ confirmationSend: true }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          const newState = { pending: false };

          if (err instanceof ValidationException) {
            const {
              isConfirmPasswordError,
              isEmailError,
              isNameError,
              isPasswordError
            } = err.errors;

            newState.higherLevelErrors = {
              confirmPasswordValueError: isConfirmPasswordError
                ? 'user.auth.input.password.not-match'
                : '',
              emailError: isEmailError ? 'user.auth.input.email.invalid' : '',
              nameError: isNameError ? 'common.form.field-min-max' : '',
              passwordError: isPasswordError
                ? 'user.auth.input.password.invalid'
                : ''
            };
          } else {
            newState.signUpErrorId =
              err.message || 'common.something-went-wrong';
          }

          this.setState(newState);
        }
      });
  };

  renderSignUpError = () => {
    const { email, signUpErrorId } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;
    const message = `${formatMessage(
      { id: signUpErrorId },
      { data: email }
    )} ${formatMessage({ id: 'common.try-again' })}`;

    return <p className="sign-up-form__error">{message}</p>;
  };

  renderSignUpForm = () => {
    const {
      higherLevelErrors: {
        confirmPasswordValueError,
        emailError,
        nameError,
        passwordError
      },
      isFormValid,
      pending,
      signUpErrorId
    } = this.state;
    const { onCancel } = this.props;
    const link = (
      <Link className="sign-up-form__link" to="/privacy-policy">
        <FormattedMessage id="app.footer.privacy" />
      </Link>
    );

    return (
      <Fragment>
        <h1 className="sign-up-form__heading">
          <FormattedMessage id="user.auth-box.create-account" />
        </h1>
        {signUpErrorId && this.renderSignUpError()}
        <form
          className="sign-up-form__form"
          noValidate
          onSubmit={isFormValid && !pending ? this.handleSignUp : null}
        >
          <AuthInput
            disabled={pending}
            externalErrorId={nameError}
            focus
            labelId="user.name"
            name="name"
            onChange={this.onNameChange}
            type="text"
            validator={this.nameValidator}
          />
          <AuthInput
            disabled={pending}
            externalErrorId={emailError}
            labelId="user.email"
            name="email"
            onChange={this.onEmailChange}
            type="text"
            validator={this.emailValidator}
          />
          <AuthInput
            disabled={pending}
            externalErrorId={passwordError}
            labelId="user.password"
            name="password"
            onChange={this.onPasswordChange}
            type="password"
            validator={this.passwordValidator}
          />
          <AuthInput
            disabled={pending}
            externalErrorId={confirmPasswordValueError}
            labelId="user.auth.input.password.confirm"
            name="confirm"
            onChange={this.onPasswordConfirmChange}
            type="password"
          />
          <div className="sign-up-form__privacy-policy-agreement">
            <FormattedMessage
              id="user.auth.privacy-policy-agreement"
              values={{ link }}
            />
          </div>
          <div className="sign-up-form__buttons">
            <button
              className="primary-button"
              disabled={pending}
              onClick={onCancel}
              type="button"
            >
              <FormattedMessage id="common.button.cancel" />
            </button>
            <PendingButton
              className="primary-button sign-up-form__confirm"
              disabled={!isFormValid}
              onClick={this.handleSignUp}
              type="submit"
            >
              <FormattedMessage id="user.auth.sign-up" />
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
          id="user.actions.sign-up.confirmation-link-sent"
          values={{ data: email }}
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
  intl: IntlPropType.isRequired,

  onCancel: PropTypes.func.isRequired
};

export default injectIntl(SignUpForm);
