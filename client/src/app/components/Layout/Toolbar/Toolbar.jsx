import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { BellIcon } from 'assets/images/icons';
import UserBar from './components/UserBar';
import AppLogo from 'common/components/AppLogo';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import ToolbarLink from './components/ToolbarLink';
import ToolbarItem from './components/ToolbarItem';
import { IntlPropType } from 'common/constants/propTypes';

const Toolbar = ({ children, intl: { formatMessage } }) => (
  <div className="toolbar">
    <div className="wrapper toolbar__wrapper">
      <div className="toolbar__left">
        <ToolbarLink
          mainIcon={<AppLogo />}
          path="/dashboard"
          title={formatMessage({
            defaultMessage: 'Go back to dashboard',
            id: 'toolbar.go-back-dashboard'
          })}
        />
      </div>
      <div className="toolbar__right">
        {children}
        <ToolbarItem
          mainIcon={<BellIcon />}
          onClick={() => {}}
          title={formatMessage({
            defaultMessage: 'Set notifications up',
            id: 'toolbar.notification'
          })}
        />
        <UserBar />
      </div>
    </div>
  </div>
);

Toolbar.propTypes = {
  children: PropTypes.node,
  intl: IntlPropType
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default injectIntl(connect(mapStateToProps)(Toolbar));
