import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import HomeLink from 'common/components/HomeLink';
import './DeleteLinkExpired.scss';

const DeleteLinkExpired = () => (
  <div className="delete-link-expired">
    <h1 className="delete-link-expired__heading">
      <HomeLink />
    </h1>
    <p>
      <FormattedMessage id="delete-link.has-expired-part1" />
      <span> </span>
      <Link className="delete-link-expired__link" to="/user-profile">
        <FormattedMessage id="delete-link.has-expired-link" />
      </Link>
      <span> </span>
      <FormattedMessage id="delete-link.has-expired-part2" />
    </p>
  </div>
);

export default DeleteLinkExpired;
