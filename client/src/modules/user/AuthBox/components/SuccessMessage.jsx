import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';

import { RouterMatchPropType } from 'common/constants/propTypes';
import { Routes } from 'common/constants/enums';
import HomeLink from 'common/components/HomeLink';
import './SuccessMessage.scss';

const SuccessMessage = ({ match: { path } }) => (
  <div className="success-message">
    <h1 className="success-message__heading">
      <HomeLink />
    </h1>
    <p className="success-message__message">
      <FormattedMessage
        id={
          path === `/${Routes.ACCOUNT_CREATED}`
            ? 'user.actions.sign-up.result-success'
            : 'user.actions.password-recovery-success'
        }
        values={{
          link: (
            <Link className="success-message__link" to="/sign-in">
              <FormattedMessage id="user.auth.sign-up.result-link" />
            </Link>
          )
        }}
      />
    </p>
  </div>
);

SuccessMessage.propTypes = {
  match: RouterMatchPropType.isRequired
};

export default withRouter(SuccessMessage);
