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
      const { cohortId, isCohortMember } = data;

      if (cohortId) {
        dispatch({ type: event, payload: data });
        history.replace(
          `/${isCohortMember ? `cohort/${cohortId}` : 'dashboard'}`
        );

        return window.location.reload();
      }

      return dispatch({ type: event, payload: data });
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};
