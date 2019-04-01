import { combineReducers } from 'redux';

import { CohortActionTypes } from './actionTypes';

const members = (state, action) => {
  switch (action.type) {
    case CohortActionTypes.ADD_MEMBER_SUCCESS: {
      const {
        payload: { data }
      } = action;
      return { ...state, data };
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
        name: action.payload.name,
        description: action.payload.description
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
    case CohortActionTypes.FETCH_META_DATA_SUCCESS:
      return action.payload;
    case CohortActionTypes.RESTORE_SUCCESS:
    case CohortActionTypes.FETCH_DETAILS_SUCCESS:
      return { ...state, [action.payload._id]: action.payload.data };
    case CohortActionTypes.FAVOURITES_SUCCESS: {
      const {
        payload: { cohortId, isFavourite }
      } = action;
      return { ...state, [cohortId]: { ...state[cohortId], isFavourite } };
    }
    case CohortActionTypes.ADD_MEMBER_SUCCESS: {
      const {
        payload: { cohortId }
      } = action;
      const { members } = state[cohortId];

      return {
        ...state,
        [cohortId]: { ...state[cohortId], members: members(members, action) }
      };
    }
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case CohortActionTypes.ARCHIVE_FAILURE:
    case CohortActionTypes.ARCHIVE_SUCCESS:
    case CohortActionTypes.CREATE_FAILURE:
    case CohortActionTypes.CREATE_SUCCESS:
    case CohortActionTypes.DELETE_FAILURE:
    case CohortActionTypes.DELETE_SUCCESS:
    case CohortActionTypes.FAVOURITES_FAILURE:
    case CohortActionTypes.FAVOURITES_SUCCESS:
    case CohortActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE:
    case CohortActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
    case CohortActionTypes.FETCH_DETAILS_FAILURE:
    case CohortActionTypes.FETCH_DETAILS_SUCCESS:
    case CohortActionTypes.FETCH_META_DATA_FAILURE:
    case CohortActionTypes.FETCH_META_DATA_SUCCESS:
    case CohortActionTypes.RESTORE_FAILURE:
    case CohortActionTypes.RESTORE_SUCCESS:
    case CohortActionTypes.UPDATE_FAILURE:
    case CohortActionTypes.UPDATE_SUCCESS:
    case CohortActionTypes.ADD_MEMBER_FAILURE:
    case CohortActionTypes.ADD_MEMBER_SUCCESS:
      return false;
    case CohortActionTypes.ARCHIVE_REQUEST:
    case CohortActionTypes.CREATE_REQUEST:
    case CohortActionTypes.DELETE_REQUEST:
    case CohortActionTypes.FAVOURITES_REQUEST:
    case CohortActionTypes.FETCH_ARCHIVED_META_DATA_REQUEST:
    case CohortActionTypes.FETCH_DETAILS_REQUEST:
    case CohortActionTypes.FETCH_META_DATA_REQUEST:
    case CohortActionTypes.RESTORE_REQUEST:
    case CohortActionTypes.UPDATE_REQUEST:
    case CohortActionTypes.ADD_MEMBER_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: cohorts, isFetching });
