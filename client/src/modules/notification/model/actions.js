import uniqueId from 'lodash/uniqueId';

import { NotificationActionTypes } from './actionsTypes';

const addNotification = notification => ({
  type: NotificationActionTypes.ADD_NOTIFICATION,
  notification
});

const removeNotification = id => ({
  type: NotificationActionTypes.REMOVE_NOTIFICATION,
  id
});

export const createNotificationWithTimeout = (
  dispatch,
  type,
  message,
  timeout = 5000
) => {
  const id = uniqueId('notification_');
  dispatch(addNotification({ id, type, message }));
  setTimeout(() => {
    dispatch(removeNotification(id));
  }, timeout);
};
