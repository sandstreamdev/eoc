import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import _flowRight from 'lodash/flowRight';
import _trim from 'lodash/trim';
import isEmail from 'validator/lib/isEmail';

import { IntlPropType, UserPropType } from 'common/constants/propTypes';
import {
  deleteAccount,
  logoutCurrentUser,
  reauthenticate,
  removeUserData
} from '../model/actions';
import DeleteDialog from './DeleteDialog';
import { ValidationException } from 'common/exceptions';
import { accountStatus, saveAccountData } from 'common/utils/localStorage';
import './DeleteAccount.scss';
import { getCurrentUser } from 'modules/user/model/selectors';

class DeleteAccount extends Component {
  state = {
    email: '',
    isDeleteDialogVisible: false,
    isErrorVisible: false,
    onlyOwnerResources: null,
    password: '',
    pending: false,
    verificationText: ''
  };

  validateForm = event => {
    event.preventDefault();

    const {
      currentUser: { isPasswordSet },
      intl: { formatMessage }
    } = this.props;
    const { email, verificationText } = this.state;
    const verificationString = formatMessage({
      id: 'user.delete-form.verify-text'
    });
    const handler = isPasswordSet
      ? this.handleDeleteAccount
      : this.handleDeleteGoogleAccount;

    if (isEmail(email) && verificationText === verificationString) {
      handler();

      return;
    }

    this.setState({ isErrorVisible: true, pending: false });
  };

  handleDeleteAccount = async () => {
    this.setState({ pending: true });

    const { removeUserData } = this.props;

    try {
      const { email, password } = this.state;
      const trimmedEmail = _trim(email);
      // const result = await deleteAccount(trimmedEmail, password);

      // if (result) {
      //   saveAccountData(accountStatus.DELETED);
      //   removeUserData();
      // }

      console.log('Usuwam konto z hasłem');
    } catch (error) {
      this.handleAccountDeleteError(error);
    }
  };

  handleDeleteGoogleAccount = async () => {
    const { email } = this.state;
    const trimmedEmail = _trim(email);

    try {
      const reauthenticated = await reauthenticate();

      if (reauthenticated) {
        const result = await deleteAccount(trimmedEmail);

        if (result) {
          //  saveAccountData(accountStatus.DELETED);
          //  removeUserData();
        }
      }
    } catch (error) {
      this.handleAccountDeleteError(error);
    }
  };

  handleAccountDeleteError = error => {
    let onlyOwnerResources;

    if (error instanceof ValidationException) {
      const { errors: resourcesData } = error;

      onlyOwnerResources = resourcesData;
    }

    this.setState({
      isErrorVisible: true,
      onlyOwnerResources,
      pending: false
    });
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
        {isDeleteDialogVisible && (
          <DeleteDialog
            error={isErrorVisible}
            onCancel={this.hideDeleteDialog}
            onConfirm={this.validateForm}
            onEmailChange={this.handleEmailChange}
            onlyOwnerResources={onlyOwnerResources}
            onPasswordChange={this.handlePasswordChange}
            onSubmit={this.validateForm}
            onVerificationTextChange={this.handleVerificationText}
            pending={pending}
          />
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
  currentUser: UserPropType,
  intl: IntlPropType.isRequired,

  logoutCurrentUser: PropTypes.func.isRequired,
  removeUserData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  connect(
    mapStateToProps,
    { logoutCurrentUser, removeUserData }
  )
)(DeleteAccount);
