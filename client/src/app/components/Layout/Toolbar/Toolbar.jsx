import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { pipe } from '@sandstreamdev/std/function';

import { BellIcon } from 'assets/images/icons';
import UserBar from './components/UserBar';
import AppLogo from 'common/components/AppLogo';
import { getCurrentUser } from 'modules/user/model/selectors';
import ToolbarLink from './components/ToolbarLink';
import ToolbarItem from './components/ToolbarItem';
import { IntlPropType } from 'common/constants/propTypes';
import Activities from 'common/components/Activities';
import './Toolbar.scss';

const Toolbar = ({ children, intl: { formatMessage } }) => (
  <div className="toolbar">
    <div className="wrapper toolbar__wrapper">
      <div className="toolbar__left">
        <ToolbarLink
          mainIcon={<AppLogo />}
          path="/dashboard"
          title={formatMessage({
            id: 'app.toolbar.go-to-dashboard'
          })}
        />
      </div>
      <div className="toolbar__right">
        {children}
        <Activities />
        <ToolbarItem
          mainIcon={<BellIcon />}
          onClick={() => {}}
          title={formatMessage({
            id: 'app.toolbar.notification-tooltip'
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

export default pipe(injectIntl, connect(mapStateToProps))(Toolbar);
