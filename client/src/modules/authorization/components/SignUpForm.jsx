import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import _some from 'lodash/some';
import validator from 'validator';

import SignUpInput from './SignUpInput';
import { signUp } from 'modules/authorization/model/actions';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import PendingButton from 'common/components/PendingButton';
import { IntlPropType } from 'common/constants/propTypes';
import { ValidationException } from 'common/exceptions/ValidationException';

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

  handleSignUp = () => {
    const { email, name, password, confirmPasswordValue } = this.state;

    this.setState({ pending: true });

    this.pendingPromise = makeAbortablePromise(
      signUp(email, name, password, confirmPasswordValue)
    );

    return this.pendingPromise.promise
      .then(() => {
        this.setState({ confirmationSend: true });
      })
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          const newState = { pending: false };

          if (err instanceof ValidationException) {
            const { errors } = err;
            newState.higherLevelErrors = errors;
          } else {
            newState.signUpErrorId =
              err.message || 'authorization.actions.sign-up.failed';
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
        nameError,
        emailError,
        confirmPasswordValueError,
        passwordError
      },
      isFormValid,
      pending,
      signUpErrorId
    } = this.state;
    const { onCancel } = this.props;

    return (
      <Fragment>
        <h1 className="sign-up-form__heading">
          <FormattedMessage id="authorization.create-account" />
        </h1>
        {signUpErrorId && this.renderSignUpError()}
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
          values={{ data: email }}
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
  intl: IntlPropType.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default injectIntl(SignUpForm);
