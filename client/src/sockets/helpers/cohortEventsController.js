import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { CohortEvents } from 'sockets/enums';
import history from 'common/utils/history';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import {
  MessageType as NotificationType,
  Routes
} from 'common/constants/enums';

const cohortEventsController = (event, data, { dispatch, getState }) => {
  switch (event) {
    case CohortEvents.LEAVE_SUCCESS: {
      const { currentUser } = getState();
      const {
        location: { pathname }
      } = history;
      const { cohortId, performer, userId } = data;
      const externalAction = {
        messageId: 'common.actions.leave',
        performer
      };

      if (currentUser.id === userId) {
        if (pathname.includes(cohortId)) {
          return dispatch({
            type: CohortEvents.REMOVE_MEMBER_SUCCESS,
            payload: { cohortId, userId, externalAction }
          });
        }

        return dispatch({
          type: CohortEvents.DELETE_SUCCESS,
          payload: { cohortId }
        });
      }

      return dispatch({
        type: CohortEvents.REMOVE_MEMBER_SUCCESS,
        payload: { cohortId, userId }
      });
    }
    case CohortEvents.REMOVE_MEMBER_SUCCESS: {
      const { currentUser } = getState();
      const {
        location: { pathname }
      } = history;
      const { cohortId, performer, userId } = data;
      const externalAction = {
        messageId: 'common.actions.user-removed-by-someone',
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
        messageId: 'common.actions.archived-by-someone',
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
        messageId: 'common.actions.deleted-by-someone',
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
    case CohortEvents.FETCH_META_DATA_SUCCESS: {
      const {
        location: { pathname }
      } = history;

      const cohortsToSave = _keyBy(
        _filter(data, list => !pathname.includes(list._id)),
        'id'
      );

      return dispatch({ type: event, payload: cohortsToSave });
    }
    case CohortEvents.ADD_OWNER_ROLE_SUCCESS: {
      const { currentUser } = getState();
      const { notificationData, userId, ...rest } = data;
      const { id: currentUserId } = currentUser;
      const currentUserRoleChanged = userId === currentUserId;
      const currentUserIsNotPerformer =
        notificationData && notificationData.performerId !== currentUserId;
      const displayNotification =
        currentUserRoleChanged && currentUserIsNotPerformer;

      if (displayNotification) {
        const { cohortName, performer } = notificationData;
        const notificationId = 'common.actions.current-user-add-to-owners';
        const notification = {
          data: {
            context: Routes.COHORT,
            name: cohortName,
            performer
          },
          notificationId
        };

        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          notification
        );
      }

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    case CohortEvents.REMOVE_OWNER_ROLE_SUCCESS: {
      const { currentUser } = getState();
      const { notificationData, userId, ...rest } = data;
      const { id: currentUserId } = currentUser;
      const currentUserRoleChanged = userId === currentUserId;
      const currentUserIsNotPerformer =
        notificationData && notificationData.performerId !== currentUserId;
      const displayNotification =
        currentUserRoleChanged && currentUserIsNotPerformer;

      if (displayNotification) {
        const { cohortName, performer } = notificationData;
        const notificationId =
          'common.actions.current-user-removed-from-owners';
        const notification = {
          data: {
            context: Routes.COHORT,
            name: cohortName,
            performer
          },
          notificationId
        };

        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          notification
        );
      }

      return dispatch({ type: event, payload: { ...rest, userId } });
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};

export default cohortEventsController;
