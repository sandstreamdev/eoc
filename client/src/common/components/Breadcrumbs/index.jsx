import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { ChevronRight } from 'assets/images/icons';

class Breadcrumbs extends PureComponent {
  render() {
    const { breadcrumbs } = this.props;

    return (
      <nav className="breadcrumbs">
        <ol className="breadcrumbs__list">
          {breadcrumbs.path.map(breadcrumb => (
            <Fragment key={breadcrumb}>
              <li className="breadcrumbs__list-item">{breadcrumb}</li>
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
  breadcrumbs: PropTypes.shape({
    path: PropTypes.arrayOf(PropTypes.string).isRequired,
    cohortId: PropTypes.string
  })
};

export default withRouter(Breadcrumbs);
