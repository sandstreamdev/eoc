import { ListEvents } from 'sockets/enums';
import history from 'common/utils/history';

export const listEventsController = (event, data, dispatch) => {
  switch (event) {
    case ListEvents.LEAVE_ON_TYPE_CHANGE_SUCCESS: {
      const { cohortId, isCohortMember, listId } = data;

      dispatch({ type: ListEvents.DELETE_SUCCESS, payload: listId });

      return history.replace(
        `/${isCohortMember ? `cohort/${cohortId}` : 'dashboard'}`
      );
    }
    case ListEvents.REMOVE_BY_SOMEONE: {
      const { cohortId, listId } = data;

      if (cohortId) {
        dispatch({ type: ListEvents.DELETE_SUCCESS, payload: listId });

        return history.replace(`/cohort/${cohortId}`);
      }
      dispatch({ type: ListEvents.DELETE_SUCCESS, payload: listId });

      return history.replace('/dashboard');
    }
    case ListEvents.ARCHIVE_SUCCESS: {
      const { cohortId } = data;

      if (cohortId) {
        dispatch({ type: event, payload: data });
        history.replace(`/cohort/${cohortId}`);

        return window.location.reload();
      }

      history.replace('/dashboard');
      window.location.reload();

      return dispatch({ type: event, payload: data });
    }
    case ListEvents.DELETE_SUCCESS: {
      const { cohortId, listId } = data;

      dispatch({ type: event, payload: listId });
      history.replace(cohortId ? `/cohort/${cohortId}` : '/dashboard');

      return;
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};
