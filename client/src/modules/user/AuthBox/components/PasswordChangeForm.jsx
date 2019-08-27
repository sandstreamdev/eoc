import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import _some from 'lodash/some';

import { changePassword } from 'modules/user/model/actions';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import {
  makeAbortablePromise,
  validatePassword,
  validateWith
} from 'common/utils/helpers';
import PendingButton from 'common/components/PendingButton';
import { IntlPropType } from 'common/constants/propTypes';
import { ValidationException } from 'common/exceptions/ValidationException';
import AuthInput from './AuthInput';

class PasswordChangeForm extends PureComponent {
  pendingPromise = null;

  constructor(props) {
    super(props);

    this.state = {
      newConfirmPasswordValue: undefined,
      higherLevelErrors: {
        newConfirmPasswordValueError: '',
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
    this.validateForm();
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
        isPasswordValid: isValid,
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

  onNewPasswordConfirmChange = (newConfirmPasswordValue, isValid) =>
    this.setState(
      { newConfirmPasswordValue, isPasswordConfirmValid: isValid },
      this.comparePasswords
    );

  passwordValidator = value =>
    validateWith(validatePassword)('user.auth.input.password.invalid')(value);

  comparePasswords = () => {
    const {
      higherLevelErrors,
      higherLevelErrors: { newConfirmPasswordValueError },
      newPassword,
      newConfirmPasswordValue
    } = this.state;
    let newError;

    if (
      newConfirmPasswordValueError &&
      newPassword === newConfirmPasswordValue
    ) {
      newError = '';
    }

    if (
      !newConfirmPasswordValueError &&
      newConfirmPasswordValue !== undefined &&
      newPassword !== newConfirmPasswordValue
    ) {
      newError = 'user.auth.input.password.not-match';
    }

    if (newError !== undefined) {
      this.setState({
        higherLevelErrors: {
          ...higherLevelErrors,
          newConfirmPasswordValueError: newError
        }
      });
    }
  };

  validateForm = () => {
    const {
      changePasswordErrorId,
      higherLevelErrors,
      isNewPasswordValid,
      isPasswordConfirmValid,
      isPasswordValid
    } = this.state;
    const isError =
      _some(higherLevelErrors, error => error !== '') ||
      changePasswordErrorId !== '';

    this.setState({
      isFormValid:
        isNewPasswordValid &&
        isPasswordConfirmValid &&
        isPasswordValid &&
        !isError
    });
  };

  handleChangePassword = event => {
    event.preventDefault();
    const { password, newPassword, newConfirmPasswordValue } = this.state;

    this.setState({ pending: true });
    this.pendingPromise = makeAbortablePromise(
      changePassword(password, newPassword, newConfirmPasswordValue)
    );

    return this.pendingPromise.promise
      .then(() => this.setState({ passwordChanged: true }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          const newState = { pending: false };

          if (err instanceof ValidationException) {
            const {
              isNewConfirmPasswordError,
              isNewPasswordError
            } = err.errors;
            newState.higherLevelErrors = {
              newConfirmPasswordValueError: isNewConfirmPasswordError
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
      higherLevelErrors: { newConfirmPasswordValueError, newPasswordError },
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
            externalErrorId={newConfirmPasswordValueError}
            formError={hasChangePasswordFailed}
            labelId="user.auth.input.new-password.confirm"
            name="confirm"
            onChange={this.onNewPasswordConfirmChange}
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
