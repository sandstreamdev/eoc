import { FETCH_ALL_COHORTS, FETCH_ALL_SHOPPING_LISTS } from './actions';
import { initalCohorts, initialShoppingLists } from './initalState';

export const shoppingLists = (state = initialShoppingLists, action) => {
  switch (action.type) {
    case FETCH_ALL_SHOPPING_LISTS:
      return [...state];
    default:
      return state;
  }
};

export const cohortsList = (state = initalCohorts, action) => {
  switch (action.type) {
    case FETCH_ALL_COHORTS:
      return [...state];
    default:
      return state;
  }
};
