import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { loginDemoUser } from 'modules/user/model/actions';
import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';
import AuthLayout from './components/AuthLayout';
import './AuthBox.scss';

class AuthBox extends PureComponent {
  state = {
    pending: false
  };

  handleLaunchingDemo = () => {
    const { loginDemoUser } = this.props;

    this.setState({ pending: true });

    try {
      return loginDemoUser();
    } finally {
      this.setState({ pending: false });
    }
  };

  render() {
    const { pending } = this.state;
    const { isCookieSet } = this.props;
    const isDisabled = !isCookieSet || pending;
    const signUpRoute = isDisabled ? '#' : '/sign-up';
    const signInRoute = isDisabled ? '#' : '/sign-in';

    return (
      <AuthLayout>
        <div className="authbox__container">
          <h1 className="authbox__header">
            <FormattedMessage id="user.auth-box.sign-in" />
          </h1>
          <div className="authbox__wrapper">
            <Link
              className="primary-link-button authbox__button"
              to={signInRoute}
            >
              <FormattedMessage id="user.auth.sign-in" />
            </Link>
          </div>
        </div>
        <div className="authbox__container">
          <h1 className="authbox__header">
            <FormattedMessage id="user.auth-box.sign-up" />
          </h1>
          <div className="authbox__wrapper">
            <Link
              className="primary-link-button authbox__button"
              to={signUpRoute}
            >
              <FormattedMessage id="user.auth-box.create-account" />
            </Link>
          </div>
        </div>
        <div className="authbox__container">
          <h1 className="authbox__header">
            <FormattedMessage id="user.auth-box.cta" />
          </h1>
          <div className="authbox__wrapper">
            <PendingButton
              className="primary-button authbox__button"
              disabled={!isCookieSet || pending}
              onClick={this.handleLaunchingDemo}
              preloaderTheme={PreloaderTheme.LIGHT}
            >
              <FormattedMessage id="user.auth-box.demo-button" />
            </PendingButton>
          </div>
        </div>
      </AuthLayout>
    );
  }
}

AuthBox.propTypes = {
  isCookieSet: PropTypes.bool,
  loginDemoUser: PropTypes.func.isRequired
};

export default connect(null, { loginDemoUser })(AuthBox);
