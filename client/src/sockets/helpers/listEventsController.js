import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { ListEvents } from 'sockets/enums';
import history from 'common/utils/history';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

const listEventsController = (event, data, { dispatch, getState }) => {
  const { currentUser } = getState();

  switch (event) {
    case ListEvents.ADD_OWNER_ROLE_SUCCESS: {
      const {
        notificationData: { listName, performer },
        userId,
        ...rest
      } = data;
      const { id: currentUserId } = currentUser;
      const displayNotification = userId === currentUserId;

      if (displayNotification) {
        const notificationId = 'list.actions.current-user-add-to-owners';
        const notificationData = {
          data: {
            listName,
            performer
          },
          notificationId
        };

        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          notificationData
        );
      }

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    case ListEvents.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        notificationData: { listName, performer },
        userId,
        ...rest
      } = data;
      const { id: currentUserId } = currentUser;
      const displayNotification = userId === currentUserId;

      if (displayNotification) {
        const notificationId = 'list.actions.current-user-removed-from-owners';
        const notificationData = {
          data: {
            listName,
            performer
          },
          notificationId
        };

        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          notificationData
        );
      }

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    case ListEvents.ADD_MEMBER_ROLE_SUCCESS: {
      const {
        notificationData: { listName, performer },
        userId,
        ...rest
      } = data;
      const { id: currentUserId } = currentUser;
      const displayNotification = userId === currentUserId;

      if (displayNotification) {
        const notificationId = 'list.actions.current-user-add-to-members';
        const notificationData = {
          data: {
            listName,
            performer
          },
          notificationId
        };

        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          notificationData
        );
      }

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    case ListEvents.REMOVE_MEMBER_ROLE_SUCCESS: {
      const {
        notificationData: { listName, performer },
        userId,
        ...rest
      } = data;
      const { id: currentUserId } = currentUser;
      const displayNotification = userId === currentUserId;

      if (displayNotification) {
        const notificationId = 'list.actions.current-user-removed-from-members';
        const notificationData = {
          data: {
            listName,
            performer
          },
          notificationId
        };

        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          notificationData
        );
      }

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    case ListEvents.CHANGE_TYPE_SUCCESS: {
      const { listId, performer, removedViewers, ...rest } = data;
      const {
        location: { pathname }
      } = history;
      const externalAction = {
        messageId: 'list.actions.list-changed-to-limited',
        performer
      };

      if (
        !pathname.includes(listId) &&
        removedViewers &&
        removedViewers.includes(currentUser.id)
      ) {
        return dispatch({
          type: ListEvents.DELETE_SUCCESS,
          payload: { listId }
        });
      }

      return dispatch({
        type: event,
        payload: { listId, externalAction, ...rest }
      });
    }
    case ListEvents.LEAVE_COHORT:
    case ListEvents.LEAVE_SUCCESS: {
      const {
        location: { pathname }
      } = history;
      const { listId, performer, userId } = data;
      const externalAction = {
        messageId: 'common.actions.leave',
        performer
      };

      if (currentUser.id === userId) {
        if (pathname.includes(listId)) {
          return dispatch({
            type: ListEvents.REMOVE_MEMBER_SUCCESS,
            payload: { listId, userId, externalAction }
          });
        }

        return dispatch({
          type: ListEvents.DELETE_SUCCESS,
          payload: { listId }
        });
      }

      return dispatch({
        type: ListEvents.REMOVE_MEMBER_SUCCESS,
        payload: { listId, userId }
      });
    }
    case ListEvents.REMOVE_COHORT_MEMBER:
    case ListEvents.REMOVE_MEMBER_SUCCESS: {
      const {
        location: { pathname }
      } = history;
      const { listId, performer, userId } = data;
      const messageId =
        event === ListEvents.REMOVE_COHORT_MEMBER
          ? 'list.actions.user-removed-from-cohort-by-someone'
          : 'common.actions.user-removed-by-someone';
      const externalAction = {
        messageId,
        performer
      };

      if (currentUser.id === userId && !pathname.includes(listId)) {
        return dispatch({
          type: ListEvents.DELETE_SUCCESS,
          payload: { listId }
        });
      }

      return dispatch({
        type: ListEvents.REMOVE_MEMBER_SUCCESS,
        payload: { ...data, externalAction }
      });
    }
    case ListEvents.ARCHIVE_SUCCESS: {
      const {
        location: { pathname }
      } = history;
      const { listId, performer } = data;
      const externalAction = {
        messageId: 'common.actions.archived-by-someone',
        performer
      };
      const { lists } = getState();

      if (lists[listId]) {
        const { isMember } = lists[listId];

        if (!pathname.includes(listId) && !isMember) {
          return dispatch({
            type: ListEvents.DELETE_SUCCESS,
            payload: { listId }
          });
        }

        return dispatch({
          type: event,
          payload: { ...data, externalAction }
        });
      }
      break;
    }
    case ListEvents.ARCHIVE_COHORT_SUCCESS:
    case ListEvents.DELETE_SUCCESS: {
      const { listId, performer } = data;
      const {
        location: { pathname }
      } = history;
      const messageId =
        event === ListEvents.ARCHIVE_COHORT_SUCCESS
          ? 'list.actions.delete-on-archive-cohort'
          : 'common.actions.deleted-by-someone';
      const externalAction = {
        messageId,
        performer
      };
      const payload = pathname.includes(listId)
        ? { listId, externalAction }
        : { listId };

      return dispatch({
        type: ListEvents.DELETE_SUCCESS,
        payload
      });
    }
    case ListEvents.MEMBER_UPDATE_SUCCESS: {
      const { userId } = data;
      const isCurrentUserUpdated = currentUser.id === userId;

      return dispatch({
        type: event,
        payload: { ...data, isCurrentUserUpdated }
      });
    }
    case ListEvents.FETCH_META_DATA_SUCCESS: {
      const {
        location: { pathname }
      } = history;

      const listsToSave = _keyBy(
        _filter(data, list => !pathname.includes(list._id)),
        'id'
      );

      return dispatch({ type: event, payload: listsToSave });
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};

export default listEventsController;
