import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import HomeLink from 'common/components/HomeLink';
import { IntlPropType } from 'common/constants/propTypes';
import './DeleteLinkExpired.scss';

const DeleteLinkExpired = ({ intl: { formatMessage } }) => (
  <div className="delete-link-expired">
    <h1 className="delete-link-expired__heading">
      <HomeLink />
    </h1>
    <p>
      <FormattedMessage
        id="delete-link.has-expired"
        values={{
          link: (
            <Link className="delete-link-expired__link" to="/user-profile">
              {formatMessage({ id: 'delete-link.has-expired-link' })}
            </Link>
          )
        }}
      />
    </p>
  </div>
);

DeleteLinkExpired.propTypes = {
  intl: IntlPropType
};

export default injectIntl(DeleteLinkExpired);
