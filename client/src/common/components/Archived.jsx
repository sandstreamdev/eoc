import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'common/components/Dialog';

const Archived = ({
  hideDialog,
  isDialogVisible,
  item,
  onDelete,
  onRestore,
  showDialog
}) => (
  <Fragment>
    <div className="archived-message">
      <h1 className="archived-message__header">
        {`This ${item} was archived.`}
      </h1>
      <button
        className="archived-message__button"
        onClick={showDialog}
        type="button"
      >
        permanently delete
      </button>
      <button
        className="archived-message__button"
        type="button"
        onClick={onRestore}
      >
        restore from archive
      </button>
    </div>
    {isDialogVisible && (
      <Dialog
        title={`Do you really want to permanently delete the ${item}?`}
        onCancel={hideDialog}
        onConfirm={onDelete}
      />
    )}
  </Fragment>
);

Archived.propTypes = {
  isDialogVisible: PropTypes.bool.isRequired,
  item: PropTypes.string.isRequired,

  hideDialog: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  showDialog: PropTypes.func.isRequired
};

export default Archived;
