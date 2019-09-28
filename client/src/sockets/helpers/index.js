import { CohortEvents, ListEvents } from 'sockets/enums';
import history from 'common/utils/history';
import { cohortsRoute, dashboardRoute } from 'common/utils/helpers';

export const listEventsController = (event, data, { dispatch, getState }) => {
  const { currentUser } = getState();

  switch (event) {
    case ListEvents.CHANGE_TYPE_SUCCESS: {
      const { listId, removedViewers, ...rest } = data;

      if (removedViewers && removedViewers.includes(currentUser.id)) {
        dispatch({ type: ListEvents.DELETE_SUCCESS, payload: { listId } });

        return history.replace(dashboardRoute());
      }

      return dispatch({ type: event, payload: { listId, ...rest } });
    }
    case ListEvents.REMOVE_MEMBER_SUCCESS: {
      const { listId, userId } = data;

      if (currentUser.id === userId) {
        dispatch({ type: ListEvents.DELETE_SUCCESS, payload: { listId } });

        return history.replace(dashboardRoute());
      }

      return dispatch({ type: event, payload: data });
    }
    case ListEvents.ARCHIVE_SUCCESS: {
      const {
        location: { pathname }
      } = history;
      const { listId } = data;
      const {
        lists: {
          [listId]: { isMember }
        }
      } = getState();

      if (!pathname.includes(listId) && !isMember) {
        return dispatch({
          type: ListEvents.DELETE_SUCCESS,
          payload: { listId }
        });
      }

      return dispatch({
        type: event,
        payload: { ...data, messageId: 'list.actions.archived-by-someone' }
      });
    }
    case ListEvents.DELETE_SUCCESS: {
      const { listId } = data;

      return dispatch({
        type: event,
        payload: { listId }
      });
    }
    case ListEvents.REMOVE_WHEN_COHORT_UNAVAILABLE: {
      const { cohortId, listId } = data;

      dispatch({ type: CohortEvents.DELETE_SUCCESS, payload: { cohortId } });
      dispatch({ type: ListEvents.DELETE_SUCCESS, payload: listId });

      return history.replace('/cohorts');
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};

export const cohortEventsController = (event, data, dispatch) => {
  switch (event) {
    case CohortEvents.REMOVED_BY_SOMEONE: {
      const { cohortId } = data;

      dispatch({ type: CohortEvents.DELETE_SUCCESS, payload: { cohortId } });

      return history.replace(cohortsRoute());
    }
    case CohortEvents.REMOVE_ON_ARCHIVE_COHORT: {
      const { cohortId, listId } = data;

      dispatch({ type: CohortEvents.DELETE_SUCCESS, payload: { cohortId } });
      dispatch({ type: ListEvents.DELETE_SUCCESS, payload: { listId } });

      return history.replace(cohortsRoute());
    }
    case CohortEvents.ARCHIVE_SUCCESS: {
      const { cohortId } = data;

      dispatch({
        type: CohortEvents.DELETE_SUCCESS,
        payload: { cohortId }
      });

      return history.replace(cohortsRoute());
    }
    case CohortEvents.REMOVE_WHEN_COHORT_UNAVAILABLE: {
      const { cohortId } = data;

      dispatch({ type: CohortEvents.DELETE_SUCCESS, payload: { cohortId } });

      return history.replace(cohortsRoute());
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};
