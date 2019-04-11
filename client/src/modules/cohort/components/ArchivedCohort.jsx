import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteCohort, restoreCohort } from 'modules/cohort/model/actions';
import { fetchListsMetaData } from 'modules/list/model/actions';
import ArchivedMessage from 'common/components/ArchivedMessage';

class ArchivedCohort extends PureComponent {
  constructor(props) {
    super(props);

    const { pending } = this.props;
    this.state = {
      pending,
      pendingMessage: ''
    };
  }

  handleCohortRestoring = cohortId => () => {
    const { fetchListsMetaData, name, restoreCohort } = this.props;

    this.setState(
      { pending: true, pendingMessage: `Restoring "${name}" cohort...` },
      () =>
        restoreCohort(cohortId)
          .then(() => fetchListsMetaData(cohortId))
          .catch(() => this.setState({ pending: false, pendingMessage: '' }))
    );
  };

  handleCohortDeletion = cohortId => () => {
    const { deleteCohort } = this.props;
    return deleteCohort(cohortId);
  };

  render() {
    const { cohortId, name } = this.props;

    const { pending, pendingMessage } = this.state;

    return (
      <ArchivedMessage
        item="cohort"
        name={name}
        pending={pending}
        pendingMessage={pendingMessage}
        onDelete={this.handleCohortDeletion(cohortId)}
        onRestore={this.handleCohortRestoring(cohortId)}
      />
    );
  }
}

ArchivedCohort.propTypes = {
  cohortId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,

  deleteCohort: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  restoreCohort: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteCohort, fetchListsMetaData, restoreCohort }
)(ArchivedCohort);
