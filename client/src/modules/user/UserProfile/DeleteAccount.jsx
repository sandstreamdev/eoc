import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _flowRight from 'lodash/flowRight';

import { IntlPropType } from 'common/constants/propTypes';
import { deleteAccount, logoutCurrentUser } from '../model/actions';
import './DeleteAccount.scss';
import DeleteDialog from './DeleteDialog';
import Dialog from 'common/components/Dialog';
import AlertBox from 'common/components/AlertBox';
import { MessageType } from 'common/constants/enums';

class DeleteAccount extends Component {
  state = {
    email: '',
    isDeleteDialogVisible: false,
    isErrorVisible: false,
    password: '',
    pending: false,
    verificationText: ''
  };

  handleDeleteAccount = async () => {
    const { email, password, verificationText } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;
    const verificationString = formatMessage({ id: 'delete-form.verify-text' });

    this.setState({ pending: true });

    try {
      if (verificationText === verificationString) {
        /**
         * const result variable is faked only for
         * front end flow test purposes, after
         * the task https://jira2.sanddev.com/secure/RapidBoard.jspa?rapidView=1&view=planning&selectedIssue=EOC-521&issueLimit=100
         * will be completed, we will await deleteAccount(email, password)
         * function here
         */
        this.setState({ isErrorVisible: false });

        const result = true; // await deleteAccount(email, password);

        if (result) {
          this.setState({
            isAccountDeletedDialogVisible: true,
            isDeleteDialogVisible: false,
            pending: false
          });
        }
      } else {
        this.setState({ pending: false });

        throw new Error();
      }
    } catch {
      this.setState({ isErrorVisible: true, pending: false });
    }
  };

  handleEmailChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ email: value });
  };

  handlePasswordChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ password: value });
  };

  handleVerificationText = event => {
    const {
      target: { value }
    } = event;

    this.setState({ verificationText: value });
  };

  showDeleteDialog = () => this.setState({ isDeleteDialogVisible: true });

  hideDeleteDialog = () => this.setState({ isDeleteDialogVisible: false });

  onCancel = () => {
    const { logoutCurrentUser } = this.props;

    logoutCurrentUser();
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const {
      isAccountDeletedDialogVisible,
      isDeleteDialogVisible,
      isErrorVisible,
      pending
    } = this.state;

    return (
      <Fragment>
        {isDeleteDialogVisible && (
          <DeleteDialog
            error={isErrorVisible}
            onCancel={this.hideDeleteDialog}
            onConfirm={this.handleDeleteAccount}
            onEmailChange={this.handleEmailChange}
            onPasswordChange={this.handlePasswordChange}
            onVerificationTextChange={this.handleVerificationText}
            pending={pending}
          />
        )}
        {isAccountDeletedDialogVisible && (
          <Dialog
            cancelLabel="common.ok"
            onCancel={this.onCancel}
            title={formatMessage({ id: 'user.account-deleted' })}
          >
            <AlertBox type={MessageType.SUCCESS}>
              <FormattedMessage id="user.account-deleted-message" />
            </AlertBox>
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
