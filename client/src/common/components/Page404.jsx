import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

const Page404 = () => (
  <div className="page-404">
    <div className="page-404__wrapper">
      <h1 className="page-404__heading">
        <FormattedMessage id="common.page-404.heading" />
      </h1>
      <p className="page-404__error">
        <FormattedMessage id="common.page-404.error" />
      </p>
      <p className="page-404__message">
        <FormattedMessage id="common.page-404.message" />
      </p>
      <Link className="primary-button" to="/dashboard">
        <FormattedMessage id="common.page-404.dashboard" />
      </Link>
    </div>
  </div>
);

export default Page404;
