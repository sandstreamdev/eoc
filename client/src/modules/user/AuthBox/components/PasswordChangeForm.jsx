import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import _some from 'lodash/some';
import validator from 'validator';

import AuthInput from './AuthInput';
import { changePassword } from 'modules/user/model/actions';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import PendingButton from 'common/components/PendingButton';
import { IntlPropType } from 'common/constants/propTypes';
import { ValidationException } from 'common/exceptions/ValidationException';

class PasswordChangeForm extends PureComponent {
  pendingPromise = null;

  constructor(props) {
    super(props);

    this.state = {
      confirmPasswordValue: undefined,
      higherLevelErrors: {
        confirmPasswordValueError: '',
        newPasswordError: ''
      },
      isFormValid: false,
      isNewPasswordValid: false,
      isPasswordConfirmValid: false,
      isPasswordValid: false,
      newPassword: '',
      password: '',
      passwordChanged: false,
      pending: false,
      changePasswordErrorId: ''
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

  onPasswordChange = (password, isValid) => {
    const { changePasswordErrorId } = this.state;
    const error = isValid ? '' : changePasswordErrorId;

    this.setState(
      {
        password,
        isPasswordValid: isValid && password.length > 0,
        changePasswordErrorId: error
      },
      this.comparePasswords
    );
  };

  onNewPasswordChange = (newPassword, isValid) => {
    const {
      higherLevelErrors,
      higherLevelErrors: { newPasswordError }
    } = this.state;
    const error = isValid ? '' : newPasswordError;

    this.setState(
      {
        higherLevelErrors: {
          ...higherLevelErrors,
          newPasswordError: error
        },
        newPassword,
        isNewPasswordValid: isValid
      },
      this.comparePasswords
    );
  };

  onPasswordConfirmChange = (confirmPasswordValue, isValid) =>
    this.setState(
      { confirmPasswordValue, isPasswordConfirmValid: isValid },
      this.comparePasswords
    );

  passwordValidator = value => {
    const { matches } = validator;

    if (!matches(value, /^[^\s]{4,32}$/)) {
      return 'user.auth.input.password.invalid';
    }

    return '';
  };

  comparePasswords = () => {
    const {
      higherLevelErrors,
      higherLevelErrors: { confirmPasswordValueError },
      newPassword,
      confirmPasswordValue
    } = this.state;
    let newError;

    if (confirmPasswordValueError && newPassword === confirmPasswordValue) {
      newError = '';
    }

    if (
      !confirmPasswordValueError &&
      confirmPasswordValue !== undefined &&
      newPassword !== confirmPasswordValue
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
      isNewPasswordValid,
      isPasswordConfirmValid,
      isPasswordValid
    } = this.state;
    const isError = _some(higherLevelErrors, error => error !== '');

    return this.setState({
      isFormValid:
        isNewPasswordValid &&
        isPasswordConfirmValid &&
        isPasswordValid &&
        !isError
    });
  };

  handleChangePassword = event => {
    event.preventDefault();
    const { password, newPassword, confirmPasswordValue } = this.state;

    this.setState({ pending: true });

    this.pendingPromise = makeAbortablePromise(
      changePassword(password, newPassword, confirmPasswordValue)
    );

    return this.pendingPromise.promise
      .then(() => this.setState({ passwordChanged: true }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          const newState = { pending: false };

          if (err instanceof ValidationException) {
            const { isConfirmPasswordError, isNewPasswordError } = err.errors;
            newState.higherLevelErrors = {
              confirmPasswordValueError: isConfirmPasswordError
                ? 'user.auth.input.password.not-match'
                : '',
              newPasswordError: isNewPasswordError
                ? 'user.auth.input.password.invalid'
                : ''
            };
          } else {
            newState.changePasswordErrorId =
              err.message || 'common.something-went-wrong';
          }

          this.setState(newState);
        }
      });
  };

  renderChangePasswordError = () => {
    const { changePasswordErrorId } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;
    const message = `${formatMessage({
      id: changePasswordErrorId
    })} ${formatMessage({ id: 'common.try-again' })}`;

    return <p className="password-change-form__error">{message}</p>;
  };

  renderChangePasswordForm = () => {
    const {
      higherLevelErrors: { confirmPasswordValueError, newPasswordError },
      isFormValid,
      pending,
      changePasswordErrorId
    } = this.state;
    const hasChangePasswordFailed = changePasswordErrorId.length > 0;

    return (
      <Fragment>
        {changePasswordErrorId && this.renderChangePasswordError()}
        <form
          className="password-change-form__form"
          noValidate
          onSubmit={isFormValid && !pending ? this.handleSignUp : null}
        >
          <AuthInput
            disabled={pending}
            formError={hasChangePasswordFailed}
            labelId="user.auth.input.current-password"
            name="new password"
            noSuccessTheme
            onChange={this.onPasswordChange}
            type="password"
          />
          <AuthInput
            disabled={pending}
            externalErrorId={newPasswordError}
            formError={hasChangePasswordFailed}
            labelId="user.auth.pass-recovery-form.heading"
            name="password"
            onChange={this.onNewPasswordChange}
            type="password"
            validator={this.passwordValidator}
          />
          <AuthInput
            disabled={pending}
            externalErrorId={confirmPasswordValueError}
            formError={hasChangePasswordFailed}
            labelId="user.auth.input.new-password.confirm"
            name="confirm"
            onChange={this.onPasswordConfirmChange}
            type="password"
          />
          <div className="password-change-form__buttons">
            <button
              className="primary-button"
              disabled={pending}
              onClick={this.handleFormClose}
              type="button"
            >
              <FormattedMessage id="common.button.cancel" />
            </button>
            <PendingButton
              className="primary-button password-change-form__confirm"
              disabled={!isFormValid}
              onClick={this.handleChangePassword}
              type="submit"
            >
              <FormattedMessage id="user.auth.change" />
            </PendingButton>
          </div>
        </form>
      </Fragment>
    );
  };

  renderConfirmationMessage = () => (
    <p className="password-change-form__confirmation">
      <FormattedMessage id="user.actions.change-password-success" />
    </p>
  );

  handleFormClose = event => {
    const { onCancel } = this.props;

    this.setState({ passwordChanged: false });
    onCancel(event);
  };

  render() {
    const { passwordChanged } = this.state;

    return (
      <div className="password-change-form">
        {passwordChanged
          ? this.renderConfirmationMessage()
          : this.renderChangePasswordForm()}
      </div>
    );
  }
}

PasswordChangeForm.propTypes = {
  intl: IntlPropType.isRequired,

  onCancel: PropTypes.func.isRequired
};

export default injectIntl(PasswordChangeForm);
