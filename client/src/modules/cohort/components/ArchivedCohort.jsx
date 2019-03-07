import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteCohort, restoreCohort } from 'modules/cohort/model/actions';
import { noOp } from 'common/utils/noOp';
import { fetchListsMetaData } from 'modules/shopping-list/model/actions';
import Archived from 'common/components/Archived';

class ArchivedList extends PureComponent {
  state = {
    isDialogVisible: false
  };

  showDialogHandler = () => {
    this.setState({ isDialogVisible: true });
  };

  hideDialogHandler = () => {
    this.setState({ isDialogVisible: false });
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
    const { isDialogVisible } = this.state;
    const { cohortId, name } = this.props;

    return (
      <Archived
        isDialogVisible={isDialogVisible}
        item="cohort"
        name={name}
        onDelete={this.deleteCohortHandler(cohortId)}
        onHideDialog={this.hideDialogHandler}
        onRestore={this.restoreCohortHandler(cohortId)}
        onShowDialog={this.showDialogHandler}
      />
    );
  }
}

ArchivedList.propTypes = {
  cohortId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  deleteCohort: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  restoreCohort: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteCohort, fetchListsMetaData, restoreCohort }
)(ArchivedList);
