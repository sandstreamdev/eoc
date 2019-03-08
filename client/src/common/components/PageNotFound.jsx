import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Toolbar from 'common/components/Toolbar';

const PageNotFound = () => (
  <Fragment>
    <div className="page-not-found">
      <Toolbar />
      <div className="page-not-found__wrapper">
        <h1 className="page-not-found__heading">Oops!</h1>
        <p className="page-not-found__error">
          Error code: 404 (page not found)
        </p>
        <p className="page-not-found__message">
          It looks that the page you are trying to reach might have been removed
          or it is temporarily unavailable.
        </p>
        <Link className="primary-button" to="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </div>
  </Fragment>
);

export default PageNotFound;
