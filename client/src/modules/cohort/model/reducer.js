import { CohortActionTypes } from '../enum';
import { initalCohorts } from './initialState';

export const cohortsList = (state = initalCohorts, action) => {
  switch (action.type) {
    case CohortActionTypes.FETCH_ALL_COHORTS_SUCCESS:
      return state;
    default:
      return state;
  }
};
