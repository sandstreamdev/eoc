import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { CohortActionTypes, CohortHeaderStatusTypes } from './actionTypes';
import { filterDefined } from 'common/utils/helpers';
import { CommonActionTypes } from 'common/model/actionTypes';

const membersReducer = (state = {}, action) => {
  switch (action.type) {
    case CohortActionTypes.ADD_MEMBER_SUCCESS: {
      const {
        member,
        member: { _id }
      } = action.payload;

      return { [_id]: member, ...state };
    }
    case CohortActionTypes.REMOVE_MEMBER_SUCCESS:
    case CohortActionTypes.LEAVE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      const { [userId]: deleted, ...rest } = state;

      return rest;
    }
    case CohortActionTypes.ADD_OWNER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return {
        ...state,
        [userId]: { ...state[userId], isOwner: true }
      };
    }
    case CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return {
        ...state,
        [userId]: { ...state[userId], isOwner: false }
      };
    }
    default:
      return state;
  }
};

const cohorts = (state = {}, action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_SUCCESS:
      return { ...state, [action.payload._id]: { ...action.payload } };
    case CohortActionTypes.UPDATE_SUCCESS: {
      const { cohortId, ...data } = action.payload;
      const previousCohort = state[cohortId];

      if (previousCohort) {
        const dataToUpdate = filterDefined(data);
        const updatedCohort = {
          ...previousCohort,
          ...dataToUpdate
        };

        return { ...state, [cohortId]: updatedCohort };
      }

      return state;
    }
    case CohortActionTypes.ARCHIVE_SUCCESS: {
      const { cohortId, externalAction } = action.payload;

      if (state[cohortId]) {
        return {
          ...state,
          [cohortId]: { ...state[cohortId], isArchived: true, externalAction }
        };
      }

      return state;
    }
    case CohortActionTypes.DELETE_SUCCESS: {
      const { cohortId, externalAction } = action.payload;

      if (state[cohortId]) {
        if (!externalAction) {
          const { [cohortId]: removed, ...newState } = state;

          return newState;
        }

        return {
          ...state,
          [cohortId]: { ...state[cohortId], isDeleted: true, externalAction }
        };
      }

      return state;
    }
    case CohortActionTypes.LEAVE_SUCCESS: {
      const { [action.payload.cohortId]: removed, ...newState } = state;

      return newState;
    }
    case CohortActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
      return { ...state, ...action.payload };
    case CohortActionTypes.FETCH_META_DATA_SUCCESS:
      return { ...state, ...action.payload };
    case CohortActionTypes.REMOVE_ARCHIVED_META_DATA:
      return _keyBy(_filter(state, cohort => !cohort.isArchived), '_id');
    case CohortActionTypes.RESTORE_SUCCESS: {
      const { cohortId, data } = action.payload;

      return {
        ...state,
        [cohortId]: { ...(state[cohortId] || {}), ...data }
      };
    }
    case CohortActionTypes.FETCH_DETAILS_SUCCESS: {
      const {
        payload,
        payload: { _id }
      } = action;

      return { ...state, [_id]: payload };
    }
    case CohortActionTypes.ADD_MEMBER_SUCCESS:
    case CohortActionTypes.REMOVE_MEMBER_SUCCESS: {
      const {
        payload: { cohortId, externalAction }
      } = action;

      if (state[cohortId]) {
        const { members } = state[cohortId];
        const cohort = {
          ...state[cohortId],
          members: membersReducer(members, action),
          externalAction
        };

        return { ...state, [cohortId]: cohort };
      }

      return state;
    }
    case CohortActionTypes.ADD_OWNER_ROLE_SUCCESS: {
      const {
        payload: { cohortId, isCurrentUserRoleChanging }
      } = action;

      if (state[cohortId]) {
        const { members } = state[cohortId];

        if (members) {
          const cohort = {
            ...state[cohortId],
            members: membersReducer(members, action)
          };

          if (isCurrentUserRoleChanging) {
            cohort.isOwner = true;
          }

          return { ...state, [cohortId]: cohort };
        }
      }

      return state;
    }
    case CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        payload: { cohortId, isCurrentUserRoleChanging }
      } = action;

      if (state[cohortId]) {
        const { members } = state[cohortId];

        if (members) {
          const cohort = {
            ...state[cohortId],
            members: membersReducer(members, action)
          };

          if (isCurrentUserRoleChanging) {
            cohort.isOwner = false;
          }

          return { ...state, [cohortId]: cohort };
        }
      }

      return state;
    }
    case CommonActionTypes.LEAVE_VIEW: {
      return {};
    }

    case CohortHeaderStatusTypes.LOCK:
    case CohortHeaderStatusTypes.UNLOCK: {
      const {
        payload: { cohortId, locks }
      } = action;
      const { locks: prevLocks } = state[cohortId];
      const updatedLocks = filterDefined(locks);

      return {
        ...state,
        [cohortId]: {
          ...state[cohortId],
          locks: { ...prevLocks, ...updatedLocks }
        }
      };
    }
    default:
      return state;
  }
};

export default cohorts;
