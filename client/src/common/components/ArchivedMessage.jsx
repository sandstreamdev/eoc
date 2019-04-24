import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'common/components/Dialog';
import Preloader from 'common/components/Preloader';
import { PENDING_DELAY } from 'common/constants/variables';

class ArchivedMessage extends PureComponent {
  state = {
    isDialogVisible: false,
    pending: false
  };

  showDialog = () => this.setState({ isDialogVisible: true });

  hideDialog = () => this.setState({ isDialogVisible: false });

  handleDeletion = () => {
    const { onDelete } = this.props;
    const delayedPending = setTimeout(
      () => this.setState({ pending: true }),
      PENDING_DELAY
    );

    onDelete()
      .catch(() => {
        this.setState({ pending: false });
        this.hideDialog();
      })
      .finally(() => clearTimeout(delayedPending));
  };

  handleRestoring = () => {
    const { onRestore } = this.props;

    const delayedPending = setTimeout(
      () => this.setState({ pending: true }),
      PENDING_DELAY
    );

    onRestore()
      .catch(() => this.setState({ pending: false }))
      .finally(() => clearTimeout(delayedPending));
  };

  render() {
    const { isDialogVisible, pending } = this.state;
    const { item, name } = this.props;

    return (
      <Fragment>
        <div className="archived-message">
          <h1 className="archived-message__header">
            {pending && !isDialogVisible
              ? `Restoring "${name}" ${item}...`
              : `The "${name}" ${item} was archived.`}
          </h1>
          {pending && !isDialogVisible ? (
            <div className="archived-message__body">
              <Preloader />
            </div>
          ) : (
            <div className="archived-message__body">
              <button
                className="archived-message__button primary-button"
                onClick={this.showDialog}
                type="button"
              >
                permanently delete
              </button>
              <button
                className="archived-message__button primary-button"
                type="button"
                onClick={this.handleRestoring}
              >
                restore from archive
              </button>
            </div>
          )}
        </div>
        {isDialogVisible && (
          <Dialog
            title={
              pending
                ? `Deleting "${name}" ${item}...`
                : `Do you really want to permanently delete the "${name}" ${item}?`
            }
            pending={pending}
            onCancel={this.hideDialog}
            onConfirm={this.handleDeletion}
          />
        )}
      </Fragment>
    );
  }
}

ArchivedMessage.propTypes = {
  item: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  onDelete: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired
};

export default ArchivedMessage;
