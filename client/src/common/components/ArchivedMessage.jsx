import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'common/components/Dialog';
import Preloader from 'common/components/Preloader';

class ArchivedMessage extends PureComponent {
  state = {
    isDialogVisible: false,
    pending: false
  };

  showDialog = () => this.setState({ isDialogVisible: true });

  hideDialog = () => this.setState({ isDialogVisible: false });

  handleDeletion = () => {
    const { onDelete } = this.props;

    this.setState({ pending: true }, () =>
      onDelete().catch(() => {
        this.setState({ pending: false });
        this.hideDialog();
      })
    );
  };

  handleRestoring = () => {
    const { onRestore } = this.props;

    this.setState({ pending: true }, () =>
      onRestore()
        .then(() => this.setState({ pending: false }))
        .catch(() => this.setState({ pending: false }))
    );
  };

  render() {
    const { isDialogVisible, pending } = this.state;
    const { item, name } = this.props;

    return (
      <Fragment>
        <div className="archived-message">
          <h1 className="archived-message__header">
            {pending
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
