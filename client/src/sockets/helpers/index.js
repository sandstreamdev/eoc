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
    case ListEvents.REMOVE_MEMBER_SUCCESS: {
      const { cohortId } = data;

      if (cohortId) {
        dispatch({ type: event, payload: data });
        history.replace(`cohort/${cohortId}`);

        return window.location.reload();
      }

      history.replace('/dashboard');
      window.location.reload();

      return dispatch({ type: event, payload: data });
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
    default:
      return dispatch({ type: event, payload: data });
  }
};
