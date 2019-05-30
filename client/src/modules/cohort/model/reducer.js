import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { CohortActionTypes } from './actionTypes';

const membersReducer = (state = [], action) => {
  switch (action.type) {
    case CohortActionTypes.ADD_MEMBER_SUCCESS: {
      const {
        payload: { data }
      } = action;
      return [...state, data];
    }
    case CohortActionTypes.REMOVE_MEMBER_SUCCESS: {
      const {
        payload: { userId }
      } = action;
      return state.filter(member => member._id !== userId);
    }
    case CohortActionTypes.ADD_OWNER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return state.map(member =>
        member._id === userId
          ? {
              ...member,
              isOwner: true
            }
          : member
      );
    }
    case CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return state.map(member =>
        member._id === userId
          ? {
              ...member,
              isOwner: false
            }
          : member
      );
    }
    default:
      return state;
  }
};

const cohorts = (state = {}, action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_SUCCESS:
      return { [action.payload._id]: { ...action.payload }, ...state };
    case CohortActionTypes.UPDATE_SUCCESS: {
      const prevCohort = state[action.payload.cohortId];
      const updatedCohort = {
        ...prevCohort,
        name: action.payload.name || prevCohort.name,
        description: action.payload.description || prevCohort.description
      };
      return { ...state, [action.payload.cohortId]: updatedCohort };
    }
    case CohortActionTypes.ARCHIVE_SUCCESS: {
      const _id = action.payload;
      const { name } = state[_id];
      const archivedCohort = { _id, isArchived: true, name };
      return { ...state, [_id]: archivedCohort };
    }
    case CohortActionTypes.DELETE_SUCCESS: {
      const { [action.payload]: removed, ...newState } = state;
      return newState;
    }
    case CohortActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case CohortActionTypes.FETCH_META_DATA_SUCCESS:
      return action.payload;
    case CohortActionTypes.REMOVE_ARCHIVED_META_DATA:
      return _keyBy(_filter(state, cohort => !cohort.isArchived), '_id');
    case CohortActionTypes.RESTORE_SUCCESS:
    case CohortActionTypes.FETCH_DETAILS_SUCCESS:
      return { ...state, [action.payload._id]: action.payload.data };
    case CohortActionTypes.ADD_MEMBER_SUCCESS:
    case CohortActionTypes.ADD_OWNER_ROLE_SUCCESS:
    case CohortActionTypes.REMOVE_MEMBER_SUCCESS: {
      const {
        payload: { cohortId }
      } = action;
      const { members } = state[cohortId];
      return {
        ...state,
        [cohortId]: {
          ...state[cohortId],
          members: membersReducer(members, action)
        }
      };
    }
    case CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        payload: { cohortId, isCurrentUserRoleChanging }
      } = action;
      const { members } = state[cohortId];
      const cohort = {
        ...state[cohortId],
        members: membersReducer(members, action)
      };

      if (isCurrentUserRoleChanging) {
        cohort.isOwner = false;
      }

      return { ...state, [cohortId]: cohort };
    }
    default:
      return state;
  }
};

export default cohorts;
