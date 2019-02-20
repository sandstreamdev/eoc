import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'common/components/Toolbar';

class Cohort extends PureComponent {
  render() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    return (
      <Fragment>
        <Toolbar />
        <div>
          Cohort of id:
          {id}
        </div>
      </Fragment>
    );
  }
}

Cohort.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};

export default Cohort;
