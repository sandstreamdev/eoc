import uniqueId from 'lodash/uniqueId';

import { NotificationActionTypes } from './actionsTypes';
import { NOTIFICATION_TIMEOUT } from 'common/constants/variables';
import { ForbiddenException } from 'common/exceptions';

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
  err = null,
  timeout = NOTIFICATION_TIMEOUT
) => {
  const forbiddenError = err instanceof ForbiddenException;
  const id = uniqueId('notification_');
  const delay = forbiddenError ? 10 : timeout;
  const messageId = forbiddenError ? 'dupa' : notification;
  dispatch(addNotification({ id, type, messageId }));
  setTimeout(() => {
    dispatch(removeNotification(id));
  }, delay);
};
