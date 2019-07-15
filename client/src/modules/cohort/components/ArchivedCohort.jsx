import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteCohort, restoreCohort } from 'modules/cohort/model/actions';
import { fetchListsMetaData } from 'modules/list/model/actions';
import ArchivedMessage from 'common/components/ArchivedMessage';

class ArchivedCohort extends PureComponent {
  handleCohortRestoring = cohortId => () => {
    const { fetchListsMetaData, restoreCohort, name } = this.props;

    return restoreCohort(cohortId, name).then(() =>
      fetchListsMetaData(cohortId)
    );
  };

  handleCohortDeletion = cohortId => () => {
    const { deleteCohort, name } = this.props;

    return deleteCohort(cohortId, name);
  };

  render() {
    const { cohortId, isOwner, name } = this.props;

    return (
      <ArchivedMessage
        isOwner={isOwner}
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
  isOwner: PropTypes.bool,
  name: PropTypes.string.isRequired,

  deleteCohort: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  restoreCohort: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteCohort, fetchListsMetaData, restoreCohort }
)(ArchivedCohort);
