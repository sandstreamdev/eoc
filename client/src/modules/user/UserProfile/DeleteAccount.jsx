import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _flowRight from 'lodash/flowRight';

import { IntlPropType } from 'common/constants/propTypes';
import './DeleteAccount.scss';
import { deleteAccount, logoutCurrentUser } from '../model/actions';
import Dialog from 'common/components/Dialog';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import DeleteForm from './DeleteForm';

class DeleteAccount extends Component {
  state = {
    isDeleteDialogVisible: false,
    isErrorVisible: false,
    pending: false
  };

  handleDeleteAccount = async () => {
    try {
      /**
       * Result variable is faked only for
       * front end flow test purposes, after
       * the task https://jira2.sanddev.com/secure/RapidBoard.jspa?rapidView=1&view=planning&selectedIssue=EOC-521&issueLimit=100
       * will be completed, we will await deleteAccount
       * function here
       */

      this.setState({ pending: true });

      const result = await deleteAccount();

      if (result) {
        this.setState({ pending: false });
      }
    } catch {
      this.setState({ isErrorVisible: true });
    }
  };

  showDeleteDialog = () => this.setState({ isDeleteDialogVisible: true });

  hideDeleteDialog = () => this.setState({ isDeleteDialogVisible: false });

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const { isDeleteDialogVisible, isErrorVisible, pending } = this.state;

    return (
      <Fragment>
        {isDeleteDialogVisible && (
          <Dialog
            confirmLabel="user.delete-account"
            hasPermissions
            onCancel={this.hideDeleteDialog}
            onConfirm={this.handleDeleteAccount}
            pending={pending}
            title={formatMessage({ id: 'user.delete-account-question' })}
          >
            {isErrorVisible ? (
              <ErrorMessage
                message={formatMessage({ id: 'user.delete-account-error' })}
              />
            ) : (
              <Fragment>
                <MessageBox type={MessageType.ERROR}>
                  <FormattedMessage id="user.delete-account-warning" />
                </MessageBox>
                <DeleteForm />
              </Fragment>
            )}
          </Dialog>
        )}
        <section className="delete-account">
          <h2 className="delete-account__heading">
            <FormattedMessage id="user.delete-account" />
          </h2>
          <ul className="delete-account__list">
            <li className="delete-account__list-item">
              <FormattedMessage id="user.delete-account" />
              <button
                className="danger-button"
                onClick={
                  isDeleteDialogVisible
                    ? this.hideDeleteDialog
                    : this.showDeleteDialog
                }
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

  logoutCurrentUser: PropTypes.func.isRequired
};

export default _flowRight(
  injectIntl,
  connect(
    null,
    { logoutCurrentUser }
  )
)(DeleteAccount);
