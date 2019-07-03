import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';

import { RouterMatchPropType } from 'common/constants/propTypes';
import AppLogo from 'common/components/AppLogo';
import { Routes } from 'common/constants/enums';

class AccountCreated extends PureComponent {
  render() {
    const {
      match: { path }
    } = this.props;

    console.log(path);

    return (
      <div className="account-created">
        <h1 className="account-created__heading">
          <AppLogo />
        </h1>
        <p className="account-created__message">
          <FormattedMessage
            id={
              path === Routes.ACCOUNT_CREATED
                ? 'authorization.sign-up.result-success'
                : 'authorization.password-recovery-success'
            }
            values={{
              link: (
                <Link className="account-created__link" to="/">
                  <FormattedMessage id="authorization.sign-up.result-link" />
                </Link>
              )
            }}
          />
        </p>
      </div>
    );
  }
}

AccountCreated.propTypes = {
  match: RouterMatchPropType.isRequired
};

export default withRouter(AccountCreated);
