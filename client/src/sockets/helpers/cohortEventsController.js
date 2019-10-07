import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { CohortEvents } from 'sockets/enums';
import history from 'common/utils/history';

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
    default:
      return dispatch({ type: event, payload: data });
  }
};

export default cohortEventsController;
