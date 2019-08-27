import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { CohortActionTypes, CohortHeaderStatusTypes } from './actionTypes';
import { filterDefined } from 'common/utils/helpers';
import { CommonActionTypes } from 'common/model/actionTypes';
import { Routes } from 'common/constants/enums';

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
      const dataToUpdate = filterDefined(data);

      const updatedCohort = {
        ...previousCohort,
        ...dataToUpdate
      };

      return { ...state, [cohortId]: updatedCohort };
    }
    case CohortActionTypes.ARCHIVE_SUCCESS: {
      const { cohortId: _id } = action.payload;
      const { name } = state[_id];
      const archivedCohort = { _id, isArchived: true, name };

      return { ...state, [_id]: archivedCohort };
    }
    case CohortActionTypes.DELETE_SUCCESS:
    case CohortActionTypes.LEAVE_SUCCESS: {
      const { [action.payload.cohortId]: removed, ...newState } = state;

      return newState;
    }
    case CohortActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case CohortActionTypes.FETCH_META_DATA_SUCCESS:
      return { ...state, ...action.payload };
    case CohortActionTypes.REMOVE_ARCHIVED_META_DATA:
      return _keyBy(_filter(state, cohort => !cohort.isArchived), '_id');
    case CohortActionTypes.RESTORE_SUCCESS:
    case CohortActionTypes.FETCH_DETAILS_SUCCESS: {
      const {
        payload,
        payload: { _id }
      } = action;

      return { ...state, [_id]: payload };
    }
    case CohortActionTypes.ADD_MEMBER_SUCCESS:
    case CohortActionTypes.REMOVE_MEMBER_SUCCESS:
    case CohortActionTypes.ADD_OWNER_ROLE_SUCCESS: {
      const {
        payload: { cohortId, isCurrentUserRoleChanging }
      } = action;
      const { members } = state[cohortId];
      const cohort = {
        ...state[cohortId],
        members: membersReducer(members, action)
      };

      if (isCurrentUserRoleChanging) {
        cohort.isOwner = true;
      }

      return { ...state, [cohortId]: cohort };
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
    case CommonActionTypes.LEAVE_VIEW: {
      const { payload } = action;

      if (payload === Routes.COHORTS) {
        return {};
      }

      return state;
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
