import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Toolbar from 'common/components/Toolbar';
import { fetchCohortDetails } from './model/actions';

class Cohort extends PureComponent {
  componentDidMount() {
    const {
      fetchCohortDetails,
      match: {
        params: { id }
      }
    } = this.props;

    fetchCohortDetails(id);
  }

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
  }).isRequired,

  fetchCohortDetails: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { fetchCohortDetails }
  )(Cohort)
);
