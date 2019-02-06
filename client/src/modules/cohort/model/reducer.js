import { CohortActionTypes } from './actionTypes';
import { initialState } from './initialState';

export const cohorts = (state = initialState, action) => {
  switch (action.type) {
    case CohortActionTypes.CREATE_COHORTS_REQUEST:
    case CohortActionTypes.FETCH_COHORTS_REQUEST:
      return {
        ...state,
        errorMessage: null
      };
    case CohortActionTypes.CREATE_COHORT_SUCCESS:
      return {
        cohorts: [action.payload, ...state],
        errorMessage: null
      };
    case CohortActionTypes.FETCH_COHORTS_SUCCESS:
      return {
        cohorts: action.payload,
        errorMessage: null
      };
    case CohortActionTypes.CREATE_COHORT_FAILURE:
    case CohortActionTypes.FETCH_COHORTS_FAILURE:
      return {
        ...state,
        errorMessage: action.errMessage
      };
    default:
      return state;
  }
};
