import React from 'react';
import { Link } from 'react-router-dom';

import Toolbar from 'common/components/Toolbar';

const Page404 = () => (
  <div className="page-404">
    <Toolbar />
    <div className="page-404__wrapper">
      <h1 className="page-404__heading">Oops!</h1>
      <p className="page-404__error">Error code: 404 (page not found)</p>
      <p className="page-404__message">
        It looks that the page you are trying to reach might have been removed
        or it is temporarily unavailable.
      </p>
      <Link className="primary-button" to="/dashboard">
        Go to dashboard
      </Link>
    </div>
  </div>
);

export default Page404;
