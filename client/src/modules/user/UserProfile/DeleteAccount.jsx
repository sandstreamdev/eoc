import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _flowRight from 'lodash/flowRight';
import _trim from 'lodash/trim';

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

  handleDeleteAccount = async event => {
    this.setState({ pending: true });
    event.preventDefault();

    const {
      intl: { formatMessage }
    } = this.props;
    const { verificationText } = this.state;
    const verificationString = formatMessage({ id: 'delete-form.verify-text' });

    try {
      if (verificationText === verificationString) {
        const { email, password } = this.state;
        const trimmedEmail = _trim(email);
        const result = await deleteAccount(trimmedEmail, password);

        this.setState({ isErrorVisible: false });

        if (result) {
          this.setState({
            isAccountDeletedDialogVisible: true,
            isDeleteDialogVisible: false,
            pending: false
          });
        }
      }

      throw new Error();
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

  handleCancel = () => {
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
            onSubmit={this.handleDeleteAccount}
            onVerificationTextChange={this.handleVerificationText}
            pending={pending}
          />
        )}
        {isAccountDeletedDialogVisible && (
          <Dialog
            cancelLabel="common.ok"
            onCancel={this.handleCancel}
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
