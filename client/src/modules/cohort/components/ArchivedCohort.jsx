import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteCohort, restoreCohort } from 'modules/cohort/model/actions';
import { noOp } from 'common/utils/noOp';
import { fetchListsMetaData } from 'modules/shopping-list/model/actions';
import Archived from 'common/components/Archived';

class ArchivedCohort extends PureComponent {
  restoreCohortHandler = cohortId => () => {
    const { fetchListsMetaData, restoreCohort } = this.props;
    restoreCohort(cohortId)
      .then(fetchListsMetaData(cohortId))
      .catch(noOp);
  };

  deleteCohortHandler = cohortId => () => {
    const { deleteCohort } = this.props;
    return deleteCohort(cohortId);
  };

  render() {
    const { cohortId, name } = this.props;

    return (
      <Archived
        item="cohort"
        name={name}
        onDelete={this.deleteCohortHandler(cohortId)}
        onRestore={this.restoreCohortHandler(cohortId)}
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
