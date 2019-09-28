import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import Dialog from 'common/components/Dialog';
import Preloader from 'common/components/Preloader';
import { IntlPropType } from 'common/constants/propTypes';
import './ArchivedMessage.scss';

class ArchivedMessage extends PureComponent {
  state = {
    isDialogVisible: false,
    pending: false
  };

  showDialog = () => this.setState({ isDialogVisible: true });

  hideDialog = () => this.setState({ isDialogVisible: false });

  handleDeletion = () => {
    const { onDelete } = this.props;

    this.setState({ pending: true });

    onDelete().catch(() => {
      this.setState({ pending: false });
      this.hideDialog();
    });
  };

  handleRestoring = () => {
    const { onRestore } = this.props;

    this.setState({ pending: true });

    onRestore().catch(() => this.setState({ pending: false }));
  };

  render() {
    const { isDialogVisible, pending } = this.state;
    const {
      intl: { formatMessage },
      isOwner,
      item,
      name
    } = this.props;

    return (
      <Fragment>
        <div className="archived-message">
          <h1 className="archived-message__header">
            {pending && !isDialogVisible ? (
              <FormattedMessage
                id="common.archived-message.restoring"
                values={{ name, item }}
              />
            ) : (
              <Fragment>
                <FormattedMessage
                  id="common.archived-message.was-archived"
                  values={{ name, item }}
                />
                {!isOwner && (
                  <FormattedMessage
                    id="common.archived-message.was-archived-member"
                    values={{ name, item }}
                  />
                )}
              </Fragment>
            )}
          </h1>
          {isOwner && (
            <div className="archived-message__body">
              <button
                className="archived-message__button primary-button"
                disabled={pending}
                onClick={this.showDialog}
                type="button"
              >
                <FormattedMessage id="common.archived-message.delete-button" />
              </button>
              <button
                className="archived-message__button primary-button"
                disabled={pending}
                type="button"
                onClick={this.handleRestoring}
              >
                <FormattedMessage id="common.archived-message.restore-button" />
              </button>
              {pending && !isDialogVisible && <Preloader />}
            </div>
          )}
        </div>
        {isDialogVisible && (
          <Dialog
            pending={pending}
            onCancel={this.hideDialog}
            onConfirm={this.handleDeletion}
            title={formatMessage(
              {
                id: pending
                  ? 'common.archived-message.deleting'
                  : 'common.archived-message.perm-delete'
              },
              { name, item }
            )}
          />
        )}
      </Fragment>
    );
  }
}

ArchivedMessage.propTypes = {
  intl: IntlPropType.isRequired,
  isOwner: PropTypes.bool,
  item: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  onDelete: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired
};

export default injectIntl(ArchivedMessage);
