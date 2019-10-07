import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { classNames } from '@sandstreamdev/std/web';
import { injectIntl } from 'react-intl';

import { ChevronRight } from 'assets/images/icons';
import { IntlPropType } from 'common/constants/propTypes';
import './Breadcrumbs.scss';

const Breadcrumbs = ({ breadcrumbs, isGuest, intl: { formatMessage } }) => {
  if (breadcrumbs.length <= 1) {
    return null;
  }

  const [firstBreadcrumb, ...restOfTheBreadcrumbs] = breadcrumbs;

  return (
    <div className="wrapper">
      <nav className="breadcrumbs">
        <ol
          className={classNames('breadcrumbs__list', {
            'breadcrumbs__list--cohort-disabled': isGuest
          })}
        >
          <li className="breadcrumbs__list-item">
            <Link to={`${firstBreadcrumb.path}`}>
              {formatMessage({
                id: `common.breadcrumbs.${firstBreadcrumb.name}`
              })}
            </Link>
          </li>
          <li className="breadcrumbs__list-item">
            <ChevronRight />
          </li>
          {restOfTheBreadcrumbs.map(breadcrumb => (
            <Fragment key={breadcrumb.path}>
              <li className="breadcrumbs__list-item">
                {breadcrumb.path ? (
                  <Link to={`${breadcrumb.path}`}>{breadcrumb.name}</Link>
                ) : (
                  breadcrumb.name
                )}
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
};

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object),
  intl: IntlPropType.isRequired,
  isGuest: PropTypes.bool
};

export default injectIntl(Breadcrumbs);
