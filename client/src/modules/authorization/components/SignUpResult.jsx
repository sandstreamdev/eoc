import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import AppLogo from 'common/components/AppLogo';
import { IntlPropType, RouterMatchPropType } from 'common/constants/propTypes';

const SignUpResult = ({
  intl: { formatMessage },
  match: {
    params: { result }
  }
}) => (
  <div className="sign-up-result">
    <h1 className="sign-up-result__heading">
      <AppLogo />
    </h1>
    <p className="sign-up-result__message">
      <FormattedMessage
        id={
          result === 'success'
            ? 'authorization.sign-up.result.success'
            : 'authorization.sign-up.result.failed'
        }
        values={{
          link: (
            <Link className="sign-up-result__link" to="/">
              {formatMessage({
                id: 'authorization.sign-up.result.link'
              })}
            </Link>
          )
        }}
      />
    </p>
  </div>
);

SignUpResult.propTypes = {
  intl: IntlPropType.isRequired,
  match: RouterMatchPropType.isRequired
};

export default injectIntl(SignUpResult);
