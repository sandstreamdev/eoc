import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import validator from 'validator';
import _flowRight from 'lodash/flowRight';
import _debounce from 'lodash/debounce';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';

import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
import { updatePassword } from '../model/actions';
import ValidationInput from './ValidationInput';
import PendingButton from 'common/components/PendingButton';

class PasswordRecoveryForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      errors: {
        comparePasswordsError: '',
        passwordError: '',
        passwordUpdateError: false
      },
      password: '',
      passwordConfirmation: '',
      passwordConfirmationSuccess: false,
      passwordSuccess: false,
      pending: false
    };

    this.debouncedPasswordValidation = _debounce(this.validatePassword, 500);
    this.debouncedComparePasswords = _debounce(this.comparePasswords, 500);
  }

  componentWillUnmount() {
    this.debouncedPasswordValidation.cancel();
    this.debouncedComparePasswords.cancel();
  }

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

  validatePassword = password => {
    const { errors } = this.state;
    const { matches } = validator;
    const validationError = !matches(password, /^[^\s]{4,32}$/);

    if (!_isEmpty(password) && !validationError) {
      this.setState(
        {
          errors: {
            ...errors,
            passwordError: ''
          },
          passwordSuccess: true
        },
        this.comparePasswords
      );
    } else {
      this.setState(
        {
          errors: {
            ...errors,
            passwordError: 'authorization.input.password.invalid'
          },
          passwordSuccess: false
        },
        this.comparePasswords
      );
    }
  };

  comparePasswords = () => {
    const { errors, password, passwordConfirmation } = this.state;

    if (_trim(password) === _trim(passwordConfirmation)) {
      this.setState({
        errors: {
          ...errors,
          comparePasswordsError: ''
        },
        passwordConfirmationSuccess: true
      });
    } else {
      this.setState({
        errors: {
          ...errors,
          comparePasswordsError: 'authorization.input.password.not-match'
        },
        passwordConfirmationSuccess: false
      });
    }

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
      errors: { passwordError, comparePasswordsError, passwordUpdateError },
      password,
      passwordConfirmation,
      passwordConfirmationSuccess,
      passwordSuccess,
      pending
    } = this.state;
    const isButtonDisabled = !passwordSuccess || !passwordConfirmationSuccess;
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <form className="pass-recovery-form" onSubmit={this.handleSubmit}>
        <h2 className="pass-recovery-form__heading">
          <FormattedMessage id="authorization.pass-recovery-form.heading" />
        </h2>
        <div className="pass-recovery-form__body">
          <ValidationInput
            errorId={passwordError}
            label={formatMessage({ id: 'authorization.input.password.label' })}
            onChange={this.handlePasswordChange}
            success={passwordSuccess}
            type="password"
            value={password}
          />
          <ValidationInput
            errorId={comparePasswordsError}
            label={formatMessage({
              id: 'authorization.input.password.confirm'
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
