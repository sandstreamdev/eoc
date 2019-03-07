import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'common/components/Dialog';

const Archived = ({
  isDialogVisible,
  item,
  name,
  onDelete,
  onHideDialog,
  onRestore,
  onShowDialog
}) => (
  <Fragment>
    <div className="archived-message">
      <h1 className="archived-message__header">
        {`The ${name} ${item} was archived.`}
      </h1>
      <button
        className="archived-message__button"
        onClick={onShowDialog}
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
        title={`Do you really want to permanently delete the ${name} ${item}?`}
        onCancel={onHideDialog}
        onConfirm={onDelete}
      />
    )}
  </Fragment>
);

Archived.propTypes = {
  isDialogVisible: PropTypes.bool.isRequired,
  item: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  onDelete: PropTypes.func.isRequired,
  onHideDialog: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onShowDialog: PropTypes.func.isRequired
};

export default Archived;
