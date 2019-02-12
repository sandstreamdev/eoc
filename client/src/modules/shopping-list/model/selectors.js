import _pick from 'lodash/pick';

export const getShoppingList = (state, listId) =>
  _pick(state.shoppingLists.data, listId)[listId];
export const getShoppingLists = state => state.shoppingLists.data;
export const getIsFetchingLists = state => state.shoppingLists.isFetching;
