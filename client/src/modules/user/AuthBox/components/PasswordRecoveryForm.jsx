import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import _debounce from 'lodash/debounce';
import validator from 'validator';

import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
import { getAccountDetails, updatePassword } from 'modules/user/model/actions';
import ValidationInput from './ValidationInput';
import PendingButton from 'common/components/PendingButton';
import {
  makeAbortablePromise,
  validatePassword,
  validateWith
} from 'common/utils/helpers';

class PasswordRecoveryForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      errors: {
        comparePasswordsError: '',
        passwordError: '',
        passwordUpdateError: false
      },
      password: '',
      passwordConfirmation: '',
      passwordConfirmationSuccess: false,
      passwordSuccess: false,
      pending: false,
      userName: null
    };

    this.debouncedPasswordValidation = _debounce(this.passwordValidator, 500);
    this.debouncedComparePasswords = _debounce(this.comparePasswords, 500);
    this.pendingPromise = null;
  }

  componentDidMount() {
    this.fetchAccountData();
  }

  componentWillUnmount() {
    this.debouncedPasswordValidation.cancel();
    this.debouncedComparePasswords.cancel();

    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  fetchAccountData = () => {
    const {
      match: {
        params: { token }
      }
    } = this.props;

    const abortable = makeAbortablePromise(getAccountDetails(token));
    this.pendingPromise = abortable;

    abortable.promise
      .then(({ displayName, email }) =>
        this.setState({ userName: displayName, email })
      )
      .catch(() => {
        /**
         * Ignore error
         */
      });
  };

  handlePasswordChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ password: value }, () =>
      this.debouncedPasswordValidation(value)
    );
  };

  handlePasswordConfirmationChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ passwordConfirmation: value }, () =>
      this.debouncedComparePasswords()
    );
  };

  handleSubmit = () => {
    const { password, passwordConfirmation } = this.state;
    const {
      match: {
        params: { token }
      }
    } = this.props;

    this.setState({ pending: true });
    updatePassword(token, password, passwordConfirmation)
      .then(() => this.setState({ pending: false }))
      .catch(() => this.handleErrors());
  };

  handleErrors = () => {
    const { errors } = this.state;

    this.setState({
      errors: {
        ...errors,
        passwordUpdateError: true
      },
      password: '',
      passwordConfirmation: '',
      passwordConfirmationSuccess: false,
      passwordSuccess: false,
      pending: false
    });
  };

  passwordValidator = password => {
    const { errors } = this.state;
    const errorMessageId = validateWith(validatePassword)(
      'user.auth.input.password.invalid'
    )(password);

    this.setState(
      {
        errors: {
          ...errors,
          passwordError: errorMessageId
        },
        passwordSuccess: errorMessageId === ''
      },
      this.comparePasswords
    );
  };

  comparePasswords = () => {
    const { errors, password, passwordConfirmation } = this.state;
    const errorMessageId = validateWith(() =>
      validator.equals(password, passwordConfirmation)
    )('user.auth.input.password.not-match')();

    this.setState({
      errors: {
        ...errors,
        comparePasswordsError: errorMessageId
      },
      passwordConfirmationSuccess: errorMessageId === ''
    });

    if (!passwordConfirmation) {
      this.setState({
        errors: {
          ...errors,
          comparePasswordsError: ''
        },
        passwordConfirmationSuccess: false
      });
    }
  };

  render() {
    const {
      email,
      errors: { passwordError, comparePasswordsError, passwordUpdateError },
      password,
      passwordConfirmation,
      passwordConfirmationSuccess,
      passwordSuccess,
      pending,
      userName
    } = this.state;
    const isButtonDisabled = !passwordSuccess || !passwordConfirmationSuccess;
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <form className="pass-recovery-form" onSubmit={this.handleSubmit}>
        <h2 className="pass-recovery-form__heading">
          {userName ? (
            <FormattedMessage
              id="user.auth.pass-recovery-form.heading-user-name"
              values={{ name: userName, email: <em title={email}>{email}</em> }}
            />
          ) : (
            <FormattedMessage id="user.auth.pass-recovery-form.heading" />
          )}
        </h2>
        <div className="pass-recovery-form__body">
          <ValidationInput
            errorId={passwordError}
            label={formatMessage({ id: 'user.password' })}
            onChange={this.handlePasswordChange}
            success={passwordSuccess}
            type="password"
            value={password}
          />
          <ValidationInput
            errorId={comparePasswordsError}
            label={formatMessage({
              id: 'user.auth.input.password.confirm'
            })}
            onChange={this.handlePasswordConfirmationChange}
            success={passwordConfirmationSuccess}
            type="password"
            value={passwordConfirmation}
          />
          <PendingButton
            className="primary-button"
            disabled={isButtonDisabled}
            onClick={this.handleSubmit}
            pending={pending}
          >
            <FormattedMessage id="common.new-comment.save" />
          </PendingButton>
          {passwordUpdateError && (
            <div className="pass-recovery-form__error">
              <FormattedMessage id="common.something-went-wrong" />
            </div>
          )}
        </div>
      </form>
    );
  }
}

PasswordRecoveryForm.propTypes = {
  intl: IntlPropType,
  match: RouterMatchPropType.isRequired
};

export default _flowRight(injectIntl, withRouter)(PasswordRecoveryForm);
