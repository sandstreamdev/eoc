import { CohortEvents, ListEvents } from 'sockets/enums';
import history from 'common/utils/history';
import {
  cohortRoute,
  cohortsRoute,
  dashboardRoute
} from 'common/utils/helpers';
import { ListActionTypes } from '../../modules/list/model/actionTypes';

export const listEventsController = (event, data, dispatch) => {
  switch (event) {
    case ListEvents.LEAVE_ON_TYPE_CHANGE_SUCCESS:
    case ListEvents.REMOVED_BY_SOMEONE:
    case ListEvents.ARCHIVE_SUCCESS:
    case ListEvents.DELETE_AND_REDIRECT: {
      const { cohortId, isCohortMember, listId } = data;

      dispatch({ type: ListActionTypes.DELETE_SUCCESS, payload: { listId } });

      const goToCohort = cohortId && isCohortMember;
      const url = goToCohort ? cohortRoute(cohortId) : dashboardRoute();

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

      dispatch({ type: CohortEvents.DELETE_SUCCESS, payload: { cohortId } });

      return history.replace(cohortsRoute());
    }
    default:
      return dispatch({ type: event, payload: data });
  }
};
