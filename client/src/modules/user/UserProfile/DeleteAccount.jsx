import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import { IntlPropType } from 'common/constants/propTypes';
import './DeleteAccount.scss';
import { deleteAccount } from '../model/actions';

class DeleteAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      didLoggedRecently: false
    };
  }

  handleDeleteAccount = () => {
    const { didLoggedRecently } = this.state;

    console.log('handleDeleteAccount');
    deleteAccount(didLoggedRecently);
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    return (
      <section className="delete-account">
        <h2 className="delete-account__heading">
          <FormattedMessage id="user.delete-account" />
        </h2>
        <ul className="delete-account__list">
          <li className="delete-account__list-item">
            <FormattedMessage id="user.delete-account" />
            <button
              className="danger-button"
              onClick={this.handleDeleteAccount}
              title={formatMessage({ id: 'user.delete-account' })}
              type="button"
            >
              <FormattedMessage id="user.delete-account" />
            </button>
          </li>
        </ul>
      </section>
    );
  }
}

DeleteAccount.propTypes = {
  intl: IntlPropType.isRequired
};

export default injectIntl(DeleteAccount);
