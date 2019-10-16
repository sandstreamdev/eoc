import React from 'react';
import { FormattedMessage } from 'react-intl';

import HomeLink from 'common/components/HomeLink';
import './AccountDeleted.scss';

const AccountDeleted = () => (
  <div className="account-deleted">
    <h1 className="account-deleted__heading">
      <HomeLink />
    </h1>
    <p className="account-deleted__message">
      <FormattedMessage id="user.account-deleted" />
    </p>
  </div>
);

export default AccountDeleted;
