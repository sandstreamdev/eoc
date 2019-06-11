import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import { injectIntl } from 'react-intl';

import { getNotifications } from './model/selectors';
import MessageBox from 'common/components/MessageBox';
import { IntlPropType } from 'common/constants/propTypes';

const Notifications = ({ notifications, intl: { formatMessage } }) => (
  <Fragment>
    {Object.entries(notifications).length > 0 && (
      <div className="notification">
        <div className="notification__wrapper">
          <ul className="notification__list">
            {_map(notifications, (item, id) => {
              const {
                notification: { notificationId, data }
              } = item;

              console.log(item);
              return (
                <li className="notification__list-item" key={id}>
                  <MessageBox
                    type={item.type}
                    message={formatMessage({ id: notificationId }, { data })}
                  />
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
  intl: IntlPropType.isRequired,
  notifications: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string))
};

const mapStateToProps = state => ({
  notifications: getNotifications(state)
});

export default injectIntl(connect(mapStateToProps)(Notifications));
