import uniqueId from 'lodash/uniqueId';

import { NotificationActionTypes } from './actionsTypes';
import { NOTIFICATION_TIMEOUT } from 'common/constants/variables';

const addNotification = payload => ({
  type: NotificationActionTypes.ADD,
  payload
});

const removeNotification = payload => ({
  type: NotificationActionTypes.REMOVE,
  payload
});

export const createNotificationWithTimeout = (
  dispatch,
  type,
  notification,
  timeout = NOTIFICATION_TIMEOUT
) => {
  const id = uniqueId('notification_');
  dispatch(addNotification({ id, type, notification }));
  setTimeout(() => {
    dispatch(removeNotification(id));
  }, timeout);
};
