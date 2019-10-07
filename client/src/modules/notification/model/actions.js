import _uniqueId from 'lodash/uniqueId';

import { NotificationActionTypes } from './actionsTypes';
import {
  NOTIFICATION_TIMEOUT,
  REDIRECT_TIMEOUT
} from 'common/constants/variables';
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
  message,
  err = null,
  timeout = NOTIFICATION_TIMEOUT
) => {
  const forbiddenError = err instanceof ForbiddenException;
  const id = _uniqueId('notification_');
  const delay = forbiddenError ? REDIRECT_TIMEOUT : timeout;
  const notification = forbiddenError
    ? { notificationId: 'user.auth.session-ended' }
    : message;
  dispatch(
    addNotification({ id, type, notification, redirect: forbiddenError })
  );
  setTimeout(() => {
    dispatch(removeNotification({ id }));
  }, delay);
};
