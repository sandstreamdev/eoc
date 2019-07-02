import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import AppLogo from 'common/components/AppLogo';
import { IntlPropType } from 'common/constants/propTypes';

const AccountCreated = ({ intl: { formatMessage } }) => (
  <div className="account-created">
    <h1 className="account-created__heading">
      <AppLogo />
    </h1>
    <p className="account-created__message">
      <FormattedMessage
        id="authorization.sign-up.result-success"
        values={{
          link: (
            <Link className="account-created__link" to="/">
              {formatMessage({
                id: 'authorization.sign-up.result-link'
              })}
            </Link>
          )
        }}
      />
    </p>
  </div>
);

AccountCreated.propTypes = {
  intl: IntlPropType.isRequired
};

export default injectIntl(AccountCreated);
