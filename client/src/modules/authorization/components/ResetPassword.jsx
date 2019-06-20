import React, { PureComponent } from 'react';
import validator from 'validator';

class ResetPassword extends PureComponent {
  state = {
    email: '',
    tipVisible: false
  };

  handleInputChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ email: value });
  };

  handleEmailValidation = () => {
    const { email } = this.state;

    return validator.isEmail(email);
  };

  handleSubmit = event => {
    event.preventDefault();
    const isEmailCorrect = this.handleEmailValidation();

    if (isEmailCorrect) {
      // handle submit here
      return;
    }

    this.handleTipVisibility();
  };

  handleTipVisibility = () => {
    this.setState({ tipVisible: true });
    setTimeout(() => this.setState({ tipVisible: false }), 6000);
  };

  render() {
    const { email, tipVisible } = this.state;

    return (
      <form className="reset-password" onSubmit={this.handleSubmit}>
        <h2 className="reset-password__heading">Reset your password</h2>
        <div className="reset-password__body">
          <label className="reset-password__email-label">
            Enter email
            <input
              className="reset-password__email-input primary-input"
              onChange={this.handleInputChange}
              type="email"
              value={email}
            />
          </label>
          {tipVisible && (
            <span className="reset-password__message-error">
              Please enter correct email.
            </span>
          )}
          <button
            className="primary-button"
            onClick={this.handleSubmit}
            type="submit"
            value="Reset password"
          >
            Reset password
          </button>
        </div>
      </form>
    );
  }
}

export default ResetPassword;
