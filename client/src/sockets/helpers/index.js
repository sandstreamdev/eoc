import { CohortEvents, ListEvents } from 'sockets/enums';
import history from 'common/utils/history';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';

export const listEventsController = (event, data, { dispatch, getState }) => {
  const { currentUser } = getState();

  switch (event) {
    case ListEvents.ADD_OWNER_ROLE_SUCCESS: {
      const {
        notificationData: { listName, performer, userName },
        userId,
        ...rest
      } = data;
      const notificationId =
        currentUser.id === userId
          ? 'list.actions.current-user-add-to-owners'
          : 'list.actions.user-add-to-owners';
      const notificationData = {
        data: {
          listName,
          performer,
          userName
        },
        notificationId
      };

      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        notificationData
      );

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    case ListEvents.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        notificationData: { listName, performer, userName },
        userId,
        ...rest
      } = data;
      const notificationId =
        currentUser.id === userId
          ? 'list.actions.current-user-removed-from-owners'
          : 'list.actions.user-removed-from-owners';
      const notificationData = {
        data: {
          listName,
          performer,
          userName
        },
        notificationId
      };

      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        notificationData
      );

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    case ListEvents.ADD_MEMBER_ROLE_SUCCESS: {
      const {
        notificationData: { listName, performer, userName },
        userId,
        ...rest
      } = data;
      const notificationId =
        currentUser.id === userId
          ? 'list.actions.current-user-add-to-members'
          : 'list.actions.user-add-to-members';
      const notificationData = {
        data: {
          listName,
          performer,
          userName
        },
        notificationId
      };

      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        notificationData
      );

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    case ListEvents.REMOVE_MEMBER_ROLE_SUCCESS: {
      const {
        notificationData: { listName, performer, userName },
        userId,
        ...rest
      } = data;
      const notificationId =
        currentUser.id === userId
          ? 'list.actions.current-user-removed-from-members'
          : 'list.actions.user-removed-from-members';
      const notificationData = {
        data: {
          listName,
          performer,
          userName
        },
        notificationId
      };

      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        notificationData
      );

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
    case ListEvents.REMOVE_COHORT_MEMBER:
    case ListEvents.REMOVE_MEMBER_SUCCESS: {
      const {
        location: { pathname }
      } = history;
      const { listId, performer, userId } = data;
      const messageId =
        event === ListEvents.REMOVE_COHORT_MEMBER
          ? 'list.actions.user-removed-from-cohort-by-someone'
          : 'list.actions.user-removed-by-someone';
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
        messageId: 'list.actions.archived-by-someone',
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
    case ListEvents.ARCHIVE_COHORT:
    case ListEvents.DELETE_SUCCESS: {
      const { listId, performer } = data;
      const {
        location: { pathname }
      } = history;
      const messageId =
        event === ListEvents.REMOVE_COHORT_MEMBER
          ? 'list.actions.deleted-by-someone'
          : 'list.actions.delete-on-archive-cohort';
      const externalAction = {
        messageId,
        performer
      };
      const payload = pathname.includes(listId)
        ? { listId, externalAction }
        : { listId, externalAction };

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
    default:
      return dispatch({ type: event, payload: data });
  }
};

export const cohortEventsController = (event, data, { dispatch, getState }) => {
  switch (event) {
    case CohortEvents.REMOVE_MEMBER_SUCCESS: {
      const { currentUser } = getState();
      const {
        location: { pathname }
      } = history;
      const { cohortId, performer, userId } = data;
      const externalAction = {
        messageId: 'cohort.actions.user-removed-by-someone',
        performer
      };

      if (currentUser.id === userId && !pathname.includes(cohortId)) {
        return dispatch({
          type: CohortEvents.DELETE_SUCCESS,
          payload: { cohortId }
        });
      }

      return dispatch({
        type: event,
        payload: { ...data, externalAction }
      });
    }
    case CohortEvents.ARCHIVE_SUCCESS: {
      const {
        location: { pathname }
      } = history;
      const { cohortId, performer } = data;
      const externalAction = {
        messageId: 'cohort.actions.archived-by-someone',
        performer
      };
      const { cohorts } = getState();

      if (pathname.includes(cohortId)) {
        return dispatch({
          type: event,
          payload: { ...data, externalAction }
        });
      }

      if (cohorts[cohortId]) {
        const { isOwner } = cohorts[cohortId];
        if (!isOwner) {
          return dispatch({
            type: CohortEvents.DELETE_SUCCESS,
            payload: { cohortId }
          });
        }
      }

      return dispatch({
        type: event,
        payload: { ...data, externalAction }
      });
    }
    case CohortEvents.DELETE_SUCCESS: {
      const { cohortId, performer } = data;
      const {
        location: { pathname }
      } = history;
      const externalAction = {
        messageId: 'cohort.actions.deleted-by-someone',
        performer
      };
      const payload = pathname.includes(cohortId)
        ? { cohortId, externalAction }
        : { cohortId };

      return dispatch({
        type: event,
        payload
      });
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};
