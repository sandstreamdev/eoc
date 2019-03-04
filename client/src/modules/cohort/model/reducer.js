import { combineReducers } from 'redux';

import { CohortActionTypes } from './actionTypes';

const cohorts = (state = {}, action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_COHORT_SUCCESS:
      return {
        ...state,
        [action.payload._id]: { ...action.payload }
      };
    case CohortActionTypes.UPDATE_SUCCESS: {
      const prevCohort = state[action.payload.cohortId];
      const updatedCohort = {
        ...prevCohort,
        name: action.payload.name,
        description: action.payload.description
      };
      return {
        ...state,
        [action.payload.cohortId]: updatedCohort
      };
    }
    case CohortActionTypes.FETCH_META_DATA_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_COHORT_FAILURE:
    case CohortActionTypes.FETCH_META_DATA_FAILURE:
    case CohortActionTypes.CREATE_COHORT_SUCCESS:
    case CohortActionTypes.FETCH_META_DATA_SUCCESS:
    case CohortActionTypes.UPDATE_SUCCESS:
    case CohortActionTypes.UPDATE_FAILURE:
      return false;
    case CohortActionTypes.CREATE_COHORT_REQUEST:
    case CohortActionTypes.FETCH_META_DATA_REQUEST:
    case CohortActionTypes.UPDATE_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: cohorts, isFetching });
