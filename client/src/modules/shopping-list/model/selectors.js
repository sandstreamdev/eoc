import _pick from 'lodash/pick';

export const getNewProductStatus = state => state.uiStatus.newProductStatus;
export const getFetchStatus = state => state.uiStatus.fetchStatus;
export const getShoppingList = (state, listId) =>
  _pick(state.shoppingLists, listId)[listId];
export const getShoppingLists = state => state.shoppingLists;
