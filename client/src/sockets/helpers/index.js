import { CohortEvents, ListEvents } from 'sockets/enums';
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
    case ListEvents.REMOVE_ON_ARCHIVE_COHORT: {
      const { cohortId, listId } = data;

      dispatch({ type: CohortEvents.DELETE_SUCCESS, payload: cohortId });
      dispatch({ type: ListEvents.DELETE_SUCCESS, payload: listId });

      return history.replace('/cohorts');
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};

export const cohortEventsController = (event, data, dispatch) => {
  switch (event) {
    case CohortEvents.ARCHIVE_SUCCESS: {
      dispatch({ type: CohortEvents.DELETE_SUCCESS, payload: data });

      return history.replace('/cohorts');
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};
