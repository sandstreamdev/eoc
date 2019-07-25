// import React, { PureComponent } from 'react';
// import { FormattedMessage, injectIntl } from 'react-intl';
// import { withRouter } from 'react-router-dom';
// import validator from 'validator';
// import _flowRight from 'lodash/flowRight';
// import _debounce from 'lodash/debounce';
// import _trim from 'lodash/trim';

// import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
// import { updatePassword } from 'modules/user/model/actions';
// import ValidationInput from './ValidationInput';
// import PendingButton from 'common/components/PendingButton';

// class PasswordUpdateForm extends PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       errors: {
//         comparePasswordsError: '',
//         passwordError: '',
//         passwordUpdateError: false
//       },
//       password: '',
//       passwordConfirmation: '',
//       passwordConfirmationSuccess: false,
//       passwordSuccess: false,
//       pending: false
//     };

//     this.debouncedPasswordValidation = _debounce(this.validatePassword, 500);
//     this.debouncedComparePasswords = _debounce(this.comparePasswords, 500);
//   }

//   componentWillUnmount() {
//     this.debouncedPasswordValidation.cancel();
//     this.debouncedComparePasswords.cancel();
//   }

//   handlePasswordChange = event => {
//     const {
//       target: { value }
//     } = event;

//     this.setState({ password: value }, () =>
//       this.debouncedPasswordValidation(value)
//     );
//   };

//   handlePasswordConfirmationChange = event => {
//     const {
//       target: { value }
//     } = event;

//     this.setState({ passwordConfirmation: value }, () =>
//       this.debouncedComparePasswords()
//     );
//   };

//   handleSubmit = () => {
//     const { password, passwordConfirmation } = this.state;
//     const {
//       match: {
//         params: { token }
//       }
//     } = this.props;

//     this.setState({ pending: true });
//     updatePassword(token, password, passwordConfirmation)
//       .then(() => this.setState({ pending: false }))
//       .catch(() => this.handleErrors());
//   };

//   handleErrors = () => {
//     const { errors } = this.state;

//     this.setState({
//       errors: {
//         ...errors,
//         passwordUpdateError: true
//       },
//       password: '',
//       passwordConfirmation: '',
//       passwordConfirmationSuccess: false,
//       passwordSuccess: false,
//       pending: false
//     });
//   };

//   validatePassword = password => {
//     const { errors } = this.state;
//     const { matches } = validator;

//     if (matches(password, /^[^\s]{4,32}$/)) {
//       this.setState(
//         {
//           errors: {
//             ...errors,
//             passwordError: ''
//           },
//           passwordSuccess: true
//         },
//         this.comparePasswords
//       );
//     } else {
//       this.setState(
//         {
//           errors: {
//             ...errors,
//             passwordError: 'user.auth.input.password.invalid'
//           },
//           passwordSuccess: false
//         },
//         this.comparePasswords
//       );
//     }
//   };

//   comparePasswords = () => {
//     const { errors, password, passwordConfirmation } = this.state;

//     if (_trim(password) === _trim(passwordConfirmation)) {
//       this.setState({
//         errors: {
//           ...errors,
//           comparePasswordsError: ''
//         },
//         passwordConfirmationSuccess: true
//       });
//     } else {
//       this.setState({
//         errors: {
//           ...errors,
//           comparePasswordsError: 'user.auth.input.password.not-match'
//         },
//         passwordConfirmationSuccess: false
//       });
//     }

//     if (!passwordConfirmation) {
//       this.setState({
//         errors: {
//           ...errors,
//           comparePasswordsError: ''
//         },
//         passwordConfirmationSuccess: false
//       });
//     }
//   };

//   render() {
//     const {
//       errors: { passwordError, comparePasswordsError, passwordUpdateError },
//       password,
//       passwordConfirmation,
//       passwordConfirmationSuccess,
//       passwordSuccess,
//       pending
//     } = this.state;
//     const isButtonDisabled = !passwordSuccess || !passwordConfirmationSuccess;
//     const {
//       intl: { formatMessage }
//     } = this.props;

//     return (
//       <form className="pass-update-form" onSubmit={this.handleSubmit}>
//         <h2 className="pass-update-form__heading">
//           <FormattedMessage id="user.auth.pass-update-form.heading" />
//         </h2>
//         <div className="pass-update-form__body">
//           <ValidationInput
//             errorId={passwordError}
//             label={formatMessage({ id: 'user.password' })}
//             onChange={this.handlePasswordChange}
//             success={passwordSuccess}
//             type="password"
//             value={password}
//           />
//           <ValidationInput
//             errorId={comparePasswordsError}
//             label={formatMessage({
//               id: 'user.auth.input.password.confirm'
//             })}
//             onChange={this.handlePasswordConfirmationChange}
//             success={passwordConfirmationSuccess}
//             type="password"
//             value={passwordConfirmation}
//           />
//           <div className="password-change-form__buttons">
//             <button
//               className="primary-button"
//               disabled={pending}
//               // onClick={onCancel}
//               type="button"
//             >
//               <FormattedMessage id="common.button.cancel" />
//             </button>
//             <PendingButton
//               className="primary-button"
//               disabled={isButtonDisabled}
//               onClick={this.handleSubmit}
//               pending={pending}
//             >
//               <FormattedMessage id="common.new-comment.save" />
//             </PendingButton>
//           </div>
//           {passwordUpdateError && (
//             <div className="pass-update-form__error">
//               <FormattedMessage id="common.something-went-wrong" />
//             </div>
//           )}
//         </div>
//       </form>
//     );
//   }
// }

// PasswordUpdateForm.propTypes = {
//   intl: IntlPropType,
//   match: RouterMatchPropType.isRequired
// };

// export default _flowRight(injectIntl, withRouter)(PasswordUpdateForm);

import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _some from 'lodash/some';
import _flowRight from 'lodash/flowRight';
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
    const { onCancel } = this.props;
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
              onClick={onCancel}
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

export default _flowRight(
  injectIntl,
  connect(
    null,
    { changePassword }
  )
)(PasswordChangeForm);
