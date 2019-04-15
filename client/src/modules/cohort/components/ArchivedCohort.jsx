import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteCohort, restoreCohort } from 'modules/cohort/model/actions';
import { fetchListsMetaData } from 'modules/list/model/actions';
import ArchivedMessage from 'common/components/ArchivedMessage';
import { noOp } from 'common/utils/noOp';

class ArchivedCohort extends PureComponent {
  handleCohortRestoring = cohortId => () => {
    const { fetchListsMetaData, restoreCohort } = this.props;

    return restoreCohort(cohortId)
      .then(() => fetchListsMetaData(cohortId))
      .catch(noOp);
  };

  handleCohortDeletion = cohortId => () => {
    const { deleteCohort } = this.props;
    return deleteCohort(cohortId);
  };

  render() {
    const { cohortId, name } = this.props;

    return (
      <ArchivedMessage
        item="cohort"
        name={name}
        onDelete={this.handleCohortDeletion(cohortId)}
        onRestore={this.handleCohortRestoring(cohortId)}
      />
    );
  }
}

ArchivedCohort.propTypes = {
  cohortId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  deleteCohort: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  restoreCohort: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteCohort, fetchListsMetaData, restoreCohort }
)(ArchivedCohort);
