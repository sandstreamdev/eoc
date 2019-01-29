import { CohortActionTypes } from './actionTypes';

export const cohorts = (state = [], action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_COHORT_SUCCESS:
      return [action.payload, ...state];
    case CohortActionTypes.FETCH_COHORTS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};
