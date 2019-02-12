import uniqueId from 'lodash/uniqueId';

import { NotificationActionTypes } from './actionsTypes';
import { NOTIFICATION_TIMEOUT } from 'common/constants/variables';

const addNotification = notification => ({
  type: NotificationActionTypes.ADD,
  payload: notification
});

const removeNotification = id => ({
  type: NotificationActionTypes.REMOVE,
  payload: id
});

export const createNotificationWithTimeout = (
  dispatch,
  type,
  message,
  timeout = NOTIFICATION_TIMEOUT
) => {
  const id = uniqueId('notification_');
  dispatch(addNotification({ id, type, message }));
  setTimeout(() => {
    dispatch(removeNotification(id));
  }, timeout);
};
