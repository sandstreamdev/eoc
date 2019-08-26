import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _map from 'lodash/map';

import { getNotifications } from './model/selectors';
import Notification from './components/Notification';
import NotificationWithTimer from './components/NotificationWithTimer';
import { REDIRECT_TIMEOUT } from 'common/constants/variables/';

const Notifications = ({ notifications }) => (
  <Fragment>
    {Object.entries(notifications).length > 0 && (
      <div className="notification">
        <div className="notification__wrapper">
          <ul className="notification__list">
            {_map(notifications, (item, id) => {
              const {
                notification: { notificationId, data },
                redirect,
                type
              } = item;

              return (
                <li className="notification__list-item" key={id}>
                  {redirect ? (
                    <NotificationWithTimer
                      id={notificationId}
                      redirect={redirect}
                      time={REDIRECT_TIMEOUT / 1000}
                      type={type}
                    />
                  ) : (
                    <Notification data={data} id={notificationId} type={type} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    )}
  </Fragment>
);

Notifications.propTypes = {
  notifications: PropTypes.objectOf(PropTypes.object)
};

const mapStateToProps = state => ({
  notifications: getNotifications(state)
});

export default connect(mapStateToProps)(Notifications);
