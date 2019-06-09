import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { BellIcon } from 'assets/images/icons';
import UserBar from './components/UserBar';
import AppLogo from 'common/components/AppLogo';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import ToolbarLink from './components/ToolbarLink';
import ToolbarItem from './components/ToolbarItem';
import Activities from 'common/components/Activities';

const Toolbar = ({ children }) => (
  <div className="toolbar">
    <div className="wrapper toolbar__wrapper">
      <div className="toolbar__left">
        <ToolbarLink
          mainIcon={<AppLogo />}
          path="/dashboard"
          title="Go back to dashboard"
        />
      </div>
      <div className="toolbar__right">
        {children}
        <Activities />
        <ToolbarItem
          mainIcon={<BellIcon />}
          onClick={() => {}}
          title="Set notifications up"
        />
        <UserBar />
      </div>
    </div>
  </div>
);

Toolbar.propTypes = {
  children: PropTypes.node
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(mapStateToProps)(Toolbar);
