import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import UserBar from './components/UserBar';
import AppLogo from 'common/components/AppLogo';
import { getCurrentUser } from 'modules/user/model/selectors';
import ToolbarLink from './components/ToolbarLink';
import { IntlPropType } from 'common/constants/propTypes';
import Activities from 'common/components/Activities';
import './Toolbar.scss';

const Toolbar = ({ children, intl: { formatMessage }, isDemoMode }) => (
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
      {isDemoMode && (
        <h2 className="toolbar__demo-title">
          <FormattedMessage id="user.auth-box.demo-button" />
        </h2>
      )}
      <div className="toolbar__right">
        {children}
        <Activities />
        <UserBar />
      </div>
    </div>
  </div>
);

Toolbar.propTypes = {
  children: PropTypes.node,
  intl: IntlPropType,
  isDemoMode: PropTypes.bool
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(injectIntl, connect(mapStateToProps))(Toolbar);
