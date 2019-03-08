import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'common/components/Dialog';

class ArchivedMessage extends PureComponent {
  state = {
    isDialogVisible: false
  };

  showDialog = () => this.setState({ isDialogVisible: true });

  hideDialog = () => this.setState({ isDialogVisible: false });

  handleDeletion = () => {
    const { onDelete } = this.props;
    onDelete().catch(this.hideDialog);
  };

  render() {
    const { isDialogVisible } = this.state;
    const { item, name, onRestore } = this.props;

    return (
      <Fragment>
        <div className="archived-message">
          <h1 className="archived-message__header">
            {`The ${name} ${item} was archived.`}
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
            onClick={onRestore}
          >
            restore from archive
          </button>
        </div>
        {isDialogVisible && (
          <Dialog
            title={`Do you really want to permanently delete the ${name} ${item}?`}
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
