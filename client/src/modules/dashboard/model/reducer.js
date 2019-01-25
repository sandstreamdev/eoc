import { FETCH_ALL_COHORTS, FETCH_ALL_SHOPPING_LISTS } from './actions';
import { initalCohorts } from './initalState';

export const shoppingLists = (state = [], action) => {
  switch (action.type) {
    case FETCH_ALL_SHOPPING_LISTS:
      return action.payload;
    default:
      return state;
  }
};

export const cohortsList = (state = initalCohorts, action) => {
  switch (action.type) {
    case FETCH_ALL_COHORTS:
      return state;
    default:
      return state;
  }
};
