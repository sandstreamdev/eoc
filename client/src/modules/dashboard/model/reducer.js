import { FETCH_ALL_COHORTS_SUCCESS } from './actions';
import { initalCohorts } from './initalState';

export const cohortsList = (state = initalCohorts, action) => {
  switch (action.type) {
    case FETCH_ALL_COHORTS_SUCCESS:
      return state;
    default:
      return state;
  }
};
