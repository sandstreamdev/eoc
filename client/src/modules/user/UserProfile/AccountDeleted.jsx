import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import HomeLink from 'common/components/HomeLink';
import { accountStatus, saveAccountData } from 'common/utils/localStorage';
import { removeUserData } from '../model/actions';
import './AccountDeleted.scss';

class AccountDeleted extends PureComponent {
  componentDidMount() {
    const { removeUserData } = this.props;

    saveAccountData(accountStatus.DELETED);
    removeUserData();
  }

  render() {
    return (
      <div className="account-deleted">
        <h1 className="account-deleted__heading">
          <HomeLink />
        </h1>
        <p className="account-deleted__message">
          <FormattedMessage id="user.account-deleted" />
        </p>
      </div>
    );
  }
}

AccountDeleted.propTypes = {
  removeUserData: PropTypes.func.isRequired
};

export default connect(null, { removeUserData })(AccountDeleted);
