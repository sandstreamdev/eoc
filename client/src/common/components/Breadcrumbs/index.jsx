import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { ChevronRight } from 'assets/images/icons';

const Breadcrumbs = ({ breadcrumbs, isGuest }) => (
  <div className="wrapper">
    <nav className="breadcrumbs">
      <ol
        className={classNames('breadcrumbs__list', {
          'breadcrumbs__list--cohort-disabled': isGuest
        })}
      >
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
  </div>
);

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object),
  isGuest: PropTypes.bool
};

export default Breadcrumbs;
