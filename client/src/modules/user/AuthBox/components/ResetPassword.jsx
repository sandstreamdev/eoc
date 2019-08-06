import React, { PureComponent } from 'react';
import validator from 'validator';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { resetPassword } from 'modules/user/model/actions';
import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';

class ResetPassword extends PureComponent {
  state = {
    email: '',
    pending: false,
    tipVisible: false
  };

  handleInputChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ email: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email } = this.state;
    const isEmailCorrect = validator.isEmail(email);
    const { resetPassword } = this.props;

    if (!isEmailCorrect) {
      this.showTip();

      return;
    }

    this.setState({ pending: true });

    return resetPassword(email)
      .finally(() => {
        this.setState({ email: '', pending: false });
        this.hideTip();
      })
      .catch(() => this.showTip());
  };

  showTip = () => this.setState({ tipVisible: true });

  hideTip = () => this.setState({ tipVisible: false });

  render() {
    const { email, pending, tipVisible } = this.state;
    const isEmailEmpty = email.length === 0;

    return (
      <form className="reset-password" onSubmit={this.handleSubmit}>
        <h2 className="reset-password__heading">
          <FormattedMessage id="user.auth.reset-password.heading" />
        </h2>
        <div className="reset-password__body">
          <label className="reset-password__email-label">
            <FormattedMessage id="user.auth.reset-password.email-label" />
            <input
              className="reset-password__email-input primary-input"
              disabled={pending}
              onChange={this.handleInputChange}
              type="email"
              value={email}
            />
          </label>
          {tipVisible && (
            <span className="reset-password__message-error">
              <FormattedMessage id="user.auth.input.email.invalid" />
            </span>
          )}
          <PendingButton
            className="primary-button"
            disabled={isEmailEmpty || pending}
            onClick={this.handleSubmit}
            preloaderTheme={PreloaderTheme.LIGHT}
          >
            <FormattedMessage id="user.auth.reset-password.button-content" />
          </PendingButton>
        </div>
      </form>
    );
  }
}

ResetPassword.propTypes = {
  resetPassword: PropTypes.func
};

export default connect(
  null,
  { resetPassword }
)(ResetPassword);
