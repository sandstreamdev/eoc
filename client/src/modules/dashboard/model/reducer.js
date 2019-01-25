import {
  FETCH_ALL_COHORTS_SUCCESS,
  FETCH_ALL_SHOPPING_LISTS_SUCCESS
} from './actions';
import { initalCohorts } from './initalState';
import { ADD_SHOPPING_LIST_SUCCESS } from 'app/components/Toolbar/model/actions';

export const shoppingLists = (state = [], action) => {
  switch (action.type) {
    case FETCH_ALL_SHOPPING_LISTS_SUCCESS:
      return action.payload;
    case ADD_SHOPPING_LIST_SUCCESS:
      return [action.payload, ...state];
    default:
      return state;
  }
};

export const cohortsList = (state = initalCohorts, action) => {
  switch (action.type) {
    case FETCH_ALL_COHORTS_SUCCESS:
      return state;
    default:
      return state;
  }
};
