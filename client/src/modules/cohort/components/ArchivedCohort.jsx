import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteCohort, restoreCohort } from 'modules/cohort/model/actions';
import { noOp } from 'common/utils/noOp';
import { fetchListsMetaData } from 'modules/shopping-list/model/actions';
import Archived from 'common/components/Archived';

class ArchivedList extends PureComponent {
  state = {
    showDialog: false
  };

  showDialog = () => {
    this.setState({ showDialog: true });
  };

  hideDialog = () => {
    this.setState({ showDialog: false });
  };

  restoreCohortHandler = cohortId => () => {
    const { fetchListsMetaData, restoreCohort } = this.props;
    restoreCohort(cohortId)
      .then(fetchListsMetaData(cohortId))
      .catch(noOp);
  };

  deleteCohortHandler = cohortId => () => {
    const { deleteCohort } = this.props;
    deleteCohort(cohortId).catch(this.hideDialog);
  };

  render() {
    const { showDialog } = this.state;
    const { cohortId } = this.props;

    return (
      <Archived
        item="list"
        isDialogVisible={showDialog}
        showDialog={this.showDialog}
        hideDialog={this.hideDialog}
        onDelete={this.deleteCohortHandler(cohortId)}
        onRestore={this.restoreCohortHandler(cohortId)}
      />
    );
  }
}

ArchivedList.propTypes = {
  cohortId: PropTypes.string.isRequired,

  deleteCohort: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  restoreCohort: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteCohort, fetchListsMetaData, restoreCohort }
)(ArchivedList);
