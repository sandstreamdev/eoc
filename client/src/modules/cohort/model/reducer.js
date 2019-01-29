import { CohortActionTypes } from './actionTypes';
import { initalCohorts } from './initialState';

export const cohorts = (state = initalCohorts, action) => {
  switch (action.type) {
    case CohortActionTypes.FETCH_COHORTS_SUCCESS:
      return state;
    default:
      return state;
  }
};
