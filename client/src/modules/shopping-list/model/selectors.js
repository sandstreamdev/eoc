import _pick from 'lodash/pick';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

export const getShoppingList = (state, listId) =>
  _pick(state.shoppingLists.data, listId)[listId];
export const getShoppingLists = state => state.shoppingLists.data;
export const getListsForCurrentCohort = (state, cohortId) =>
  _keyBy(
    _filter(
      state.shoppingLists.data,
      (value, key) => value.cohortId === cohortId
    ),
    '_id'
  );

export const getIsFetchingLists = state => state.shoppingLists.isFetching;
