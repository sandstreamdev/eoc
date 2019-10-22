import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _flowRight from 'lodash/flowRight';
import _trim from 'lodash/trim';

import { IntlPropType } from 'common/constants/propTypes';
import {
  checkIfDataLeft,
  deleteAccount,
  logoutCurrentUser,
  removeUserData
} from '../model/actions';
import DeleteDialog from './DeleteDialog';
import { ValidationException } from 'common/exceptions';
import { accountStatus, saveAccountData } from 'common/utils/localStorage';
import './DeleteAccount.scss';

class DeleteAccount extends Component {
  state = {
    email: '',
    isDeleteDialogVisible: false,
    isErrorVisible: false,
    isSelectionDialogVisible: false,
    onlyOwnerResources: null,
    password: '',
    pending: false,
    verificationText: ''
  };

  handleDeleteAccount = async event => {
    this.setState({ pending: true });
    event.preventDefault();

    const {
      intl: { formatMessage },
      removeUserData
    } = this.props;
    const { verificationText } = this.state;
    const verificationString = formatMessage({
      id: 'user.delete-form.verify-text'
    });

    if (verificationText !== verificationString) {
      this.setState({ isErrorVisible: true, pending: false });

      return;
    }

    try {
      const { email, password } = this.state;
      const trimmedEmail = _trim(email);
      const result = await deleteAccount(trimmedEmail, password);

      if (result) {
        saveAccountData(accountStatus.DELETED);
        removeUserData();
      }
    } catch (err) {
      let onlyOwnerResources;

      if (err instanceof ValidationException) {
        const { errors: resourcesData } = err;

        onlyOwnerResources = resourcesData;
      }

      console.log(onlyOwnerResources);

      this.setState({
        isErrorVisible: true,
        onlyOwnerResources,
        pending: false
      });
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

  handleOnClick = async () => {
    const { email } = this.state;

    this.setState({ pending: true });

    try {
      const result = await checkIfDataLeft(email);

      if (result) {
        this.setState({
          isDeleteDialogVisible: true,
          isSelectionDialogVisible: false,
          pending: false
        });
      }
    } catch {
      this.setState({
        isErrorVisible: true,
        isSelectionDialogVisible: true,
        pending: false
      });
    }
  };

  showDeleteDialog = () => this.setState({ isDeleteDialogVisible: true });

  hideDeleteDialog = () =>
    this.setState({
      isDeleteDialogVisible: false,
      isErrorVisible: false,
      onlyOwnerResources: null
    });

  handleCancel = () => {
    const { logoutCurrentUser } = this.props;

    logoutCurrentUser();
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const {
      isDeleteDialogVisible,
      isErrorVisible,
      onlyOwnerResources,
      pending
    } = this.state;

    return (
      <Fragment>
        <DeleteDialog
          error={isErrorVisible}
          isVisible={isDeleteDialogVisible}
          onCancel={this.hideDeleteDialog}
          onConfirm={this.handleDeleteAccount}
          onEmailChange={this.handleEmailChange}
          onlyOwnerResources={onlyOwnerResources}
          onPasswordChange={this.handlePasswordChange}
          onSubmit={this.handleDeleteAccount}
          onVerificationTextChange={this.handleVerificationText}
          pending={pending}
        />
        <section className="delete-account">
          <h2 className="delete-account__heading">
            <FormattedMessage id="user.delete-account" />
          </h2>
          <ul className="delete-account__list">
            <li className="delete-account__list-item">
              <FormattedMessage id="user.delete-account" />
              <button
                className="danger-button"
                onClick={this.handleOnClick}
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

  logoutCurrentUser: PropTypes.func.isRequired,
  removeUserData: PropTypes.func.isRequired
};

export default _flowRight(
  injectIntl,
  connect(
    null,
    { logoutCurrentUser, removeUserData }
  )
)(DeleteAccount);
