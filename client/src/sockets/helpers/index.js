import { CohortEvents, ListEvents } from 'sockets/enums';
import history from 'common/utils/history';
import { Routes } from 'common/constants/enums';
import { routeGenerator } from 'common/utils/helpers';

export const listEventsController = (event, data, dispatch) => {
  switch (event) {
    case ListEvents.LEAVE_ON_TYPE_CHANGE_SUCCESS:
    case ListEvents.REMOVED_BY_SOMEONE: {
      const { cohortId, isCohortMember, listId } = data;

      dispatch({ type: ListEvents.DELETE_SUCCESS, payload: listId });

      const goToCohort = cohortId && isCohortMember;

      const url = goToCohort
        ? routeGenerator(Routes.COHORT, cohortId)
        : routeGenerator(Routes.DASHBOARD);

      return history.replace(url);
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};

export const cohortEventsController = (event, data, dispatch) => {
  switch (event) {
    case CohortEvents.REMOVED_BY_SOMEONE: {
      const { cohortId } = data;

      dispatch({ type: CohortEvents.DELETE_SUCCESS, payload: cohortId });

      return history.replace(routeGenerator(Routes.COHORTS));
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};
