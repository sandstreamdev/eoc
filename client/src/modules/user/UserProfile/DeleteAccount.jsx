import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _flowRight from 'lodash/flowRight';

import { IntlPropType } from 'common/constants/propTypes';
import './DeleteAccount.scss';
import { deleteAccount, logoutCurrentUser } from '../model/actions';
import Dialog from 'common/components/Dialog';
import { SessionInfo } from 'common/constants/enums';
import ErrorMessage from 'common/components/Forms/ErrorMessage';

class DeleteAccount extends Component {
  state = {
    isDeleteDialogVisible: false,
    isErrorVisible: false,
    isLoginDialogVisible: false,
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

      const result = SessionInfo.UPDATED_LONG_TIME_AGO; // await deleteAccount();

      if (result === SessionInfo.UPDATED_LONG_TIME_AGO) {
        this.showLoginDialog();
        this.setState({ pending: false });
      } else {
        deleteAccount();
      }
    } catch {
      this.setState({ isErrorVisible: true });
    }
  };

  handleSignIn = () => {
    const { logoutCurrentUser } = this.props;

    logoutCurrentUser();
  };

  showDeleteDialog = () => this.setState({ isDeleteDialogVisible: true });

  hideDeleteDialog = () => this.setState({ isDeleteDialogVisible: false });

  showLoginDialog = () =>
    this.setState({ isLoginDialogVisible: true }, this.hideDeleteDialog);

  hideLoginDialog = () => this.setState({ isLoginDialogVisible: false });

  hideAllDialogs = () =>
    this.setState({
      isLoginDialogVisible: false,
      isDeleteDialogVisible: false
    });

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const {
      isDeleteDialogVisible,
      isErrorVisible,
      isLoginDialogVisible,
      pending
    } = this.state;

    return (
      <Fragment>
        {isDeleteDialogVisible && (
          <Dialog
            confirmLabel="user.delete-account"
            hasPermissions
            onCancel={this.hideDeleteDialog}
            onConfirm={this.handleDeleteAccount}
            pending={pending}
            title={formatMessage({ id: 'user.delete-account' })}
          >
            {isErrorVisible ? (
              <ErrorMessage
                message={formatMessage({ id: 'user.delete-account-error' })}
              />
            ) : (
              <FormattedMessage id="user.delete-account-dialog" />
            )}
          </Dialog>
        )}
        {isLoginDialogVisible && (
          <Dialog
            confirmLabel="user.auth.sign-in"
            hasPermissions
            onCancel={this.hideAllDialogs}
            onConfirm={this.handleSignIn}
            pending={pending}
            title={formatMessage({ id: 'user.authorize-identity' })}
          >
            <FormattedMessage id="user.authorize-identity-message" />
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
                  isLoginDialogVisible
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
