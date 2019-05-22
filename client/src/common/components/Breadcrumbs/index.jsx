import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ChevronRight } from 'assets/images/icons';

class Breadcrumbs extends PureComponent {
  render() {
    const { breadcrumbs } = this.props;

    return (
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
  }
}

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object)
};

export default Breadcrumbs;
