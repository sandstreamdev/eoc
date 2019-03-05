import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Dialog from 'common/components/Dialog';
import { deleteCohort, restoreCohort } from 'modules/cohort/model/actions';
import { noOp } from 'common/utils/noOp';
import { fetchListMetaData } from 'modules/shopping-list/model/actions';

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
    const { fetchListMetaData, restoreCohort } = this.props;
    restoreCohort(cohortId)
      .then(fetchListMetaData(cohortId))
      .catch(noOp);
  };

  deleteCohortHandler = cohortId => () => {
    const { deleteCohort } = this.props;
    deleteCohort(cohortId);
  };

  render() {
    const { showDialog } = this.state;
    const { cohortId } = this.props;

    return (
      <Fragment>
        <div className="archived-message">
          <h1 className="archived-message__header">
            This cohort was archived.
          </h1>
          <button
            className="archived-message__button"
            onClick={this.showDialog}
            type="button"
          >
            permanently delete
          </button>
          <button
            className="archived-message__button"
            type="button"
            onClick={this.restoreCohortHandler(cohortId)}
          >
            restore from archive
          </button>
        </div>
        {showDialog && (
          <Dialog
            title="Do you really want to permanently delete the cohort?"
            onCancel={this.hideDialog}
            onConfirm={this.deleteCohortHandler(cohortId)}
          />
        )}
      </Fragment>
    );
  }
}

ArchivedList.propTypes = {
  cohortId: PropTypes.string.isRequired,

  deleteCohort: PropTypes.func.isRequired,
  fetchListMetaData: PropTypes.func.isRequired,
  restoreCohort: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteCohort, fetchListMetaData, restoreCohort }
)(ArchivedList);
