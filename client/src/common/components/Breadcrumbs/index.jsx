import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { RouterMatchPropType } from 'common/constants/propTypes';

class Breadcrumbs extends PureComponent {
  render() {
    const { match } = this.props;
    const { breadcrumbs } = this.props;

    console.log(breadcrumbs);
    return (
      <nav className="breadcrumbs">
        <ol className="breadcrumbs__list">
          <li className="breadcrumbs__list-item">{match.path}</li>
          <li className="breadcrumbs__list-item">/</li>
        </ol>
      </nav>
    );
  }
}

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.shape({
    path: PropTypes.arrayOf(PropTypes.string).isRequired,
    cohortId: PropTypes.string
  }),
  match: RouterMatchPropType.isRequired
};

export default withRouter(Breadcrumbs);
