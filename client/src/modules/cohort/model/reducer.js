import { combineReducers } from 'redux';

import { CohortActionTypes } from './actionTypes';

const cohort = (state = {}, action) => {
  switch (action.type) {
    case CohortActionTypes.FETCH_DETAILS_SUCCESS:
      return {
        ...state,
        listIds: action.payload.data
      };

    default:
      state;
  }
};

const cohorts = (state = {}, action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_COHORT_SUCCESS:
      return [action.payload, ...state];
    case CohortActionTypes.FETCH_META_DATA_SUCCESS:
      return action.payload;
    case CohortActionTypes.FETCH_DETAILS_SUCCESS: {
      const currentCohort = state[action.payload.cohortId];

      return {
        ...state,
        [action.payload.cohortId]: cohort(currentCohort, action)
      };
    }
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
      return false;
    case CohortActionTypes.CREATE_COHORT_REQUEST:
    case CohortActionTypes.FETCH_META_DATA_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: cohorts, isFetching });
