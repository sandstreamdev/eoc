import React, { Component, Fragment } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _flowRight from 'lodash/flowRight';
import PropTypes from 'prop-types';

import { checkIfDataLeft, sendDeleteAccountMail } from '../model/actions';
import { ValidationException } from 'common/exceptions';
import { IntlPropType } from 'common/constants/propTypes';
import ResourcePanel from './ResourcePanel';
import DeleteDialog from './DeleteDialog';
import Dialog from 'common/components/Dialog';
import './DeleteAccount.scss';

class DeleteAccount extends Component {
  state = {
    isDeleteDialogVisible: false,
    isErrorVisible: false,
    isOwnershipTransferDialogVisible: false,
    onlyOwnerResources: null,
    pending: false
  };

  handleConfirm = async event => {
    this.setState({ pending: true });
    event.preventDefault();

    const { sendDeleteAccountMail } = this.props;

    sendDeleteAccountMail();
    this.setState({ isDeleteDialogVisible: false, pending: false });
  };

  handleOnDeleteClick = async () => {
    this.setState({ pending: true });

    try {
      const result = await checkIfDataLeft();

      if (result) {
        this.hideOwnershipTransferDialog();
        this.showDeleteDialog();
        this.setState({
          isErrorVisible: false,
          pending: false
        });
      }
    } catch (error) {
      let onlyOwnerResources;

      if (error instanceof ValidationException) {
        const { errors: resourcesData } = error;

        onlyOwnerResources = resourcesData;
      }

      this.setState(
        {
          isErrorVisible: true,
          onlyOwnerResources,
          pending: false
        },
        this.showOwnershipTransferDialog
      );
    }
  };

  showDeleteDialog = () => this.setState({ isDeleteDialogVisible: true });

  hideDeleteDialog = () =>
    this.setState({
      isDeleteDialogVisible: false,
      isErrorVisible: false,
      onlyOwnerResources: null
    });

  showOwnershipTransferDialog = () =>
    this.setState({ isOwnershipTransferDialogVisible: true });

  hideOwnershipTransferDialog = () =>
    this.setState({ isOwnershipTransferDialogVisible: false });

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const {
      isDeleteDialogVisible,
      isErrorVisible,
      isOwnershipTransferDialogVisible,
      onlyOwnerResources,
      pending
    } = this.state;

    return (
      <Fragment>
        <DeleteDialog
          error={isErrorVisible}
          isVisible={isDeleteDialogVisible}
          onCancel={this.hideDeleteDialog}
          onConfirm={this.handleConfirm}
          pending={pending}
        />
        <Dialog
          cancelLabel={formatMessage({ id: 'common.button.cancel' })}
          isVisible={isOwnershipTransferDialogVisible}
          onCancel={this.hideOwnershipTransferDialog}
          pending={pending}
          title={formatMessage({
            id: 'user.delete-account.ownership-header'
          })}
        >
          <ResourcePanel resources={onlyOwnerResources} />
        </Dialog>
        <section className="delete-account">
          <h2 className="delete-account__heading">
            <FormattedMessage id="user.delete-account" />
          </h2>
          <ul className="delete-account__list">
            <li className="delete-account__list-item">
              <FormattedMessage id="user.delete-account" />
              <button
                className="danger-button"
                onClick={this.handleOnDeleteClick}
                title={formatMessage({ id: 'user.delete-account' })}
                type="button"
              >
                <FormattedMessage id="user.delete-account" />
              </button>
            </li>
          </ul>
        </section>
      </Fragment>
    );
  }
}

DeleteAccount.propTypes = {
  intl: IntlPropType.isRequired,

  sendDeleteAccountMail: PropTypes.func.isRequired
};

export default _flowRight(
  injectIntl,
  connect(
    null,
    { sendDeleteAccountMail }
  )
)(DeleteAccount);
