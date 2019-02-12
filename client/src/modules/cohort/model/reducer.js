import { combineReducers } from 'redux';

import { CohortActionTypes } from './actionTypes';

const data = (state = [], action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_COHORT_SUCCESS:
      return [action.payload, ...state];
    case CohortActionTypes.FETCH_COHORTS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_COHORT_FAILURE:
    case CohortActionTypes.FETCH_COHORTS_FAILURE:
    case CohortActionTypes.CREATE_COHORT_SUCCESS:
    case CohortActionTypes.FETCH_COHORTS_SUCCESS:
      return false;
    case CohortActionTypes.CREATE_COHORT_REQUEST:
    case CohortActionTypes.FETCH_COHORTS_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data, isFetching });
