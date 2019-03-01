import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _map from 'lodash/map';

import { getNotifications } from './model/selectors';
import MessageBox from 'common/components/MessageBox';

const Notifications = ({ notifications }) => (
  <Fragment>
    {Object.entries(notifications).length > 0 && (
      <div className="notification">
        <div className="notification__wrapper">
          <ul>
            {_map(notifications, (item, id) => (
              <li key={id}>
                <MessageBox type={item.type} message={item.message} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </Fragment>
);

Notifications.propTypes = {
  notifications: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string))
};

const mapStateToProps = state => ({
  notifications: getNotifications(state)
});

export default connect(mapStateToProps)(Notifications);
