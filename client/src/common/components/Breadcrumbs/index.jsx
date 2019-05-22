import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ChevronRight } from 'assets/images/icons';

const Breadcrumbs = ({ breadcrumbs }) => (
  <nav className="breadcrumbs">
    <ol className="breadcrumbs__list">
      {breadcrumbs.map(breadcrumb => (
        <Fragment key={breadcrumb.name}>
          <li className="breadcrumbs__list-item">
            <Link to={`${breadcrumb.path}`}>{breadcrumb.name}</Link>
          </li>
          <li className="breadcrumbs__list-item">
            <ChevronRight />
          </li>
        </Fragment>
      ))}
    </ol>
  </nav>
);

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object)
};

export default Breadcrumbs;
