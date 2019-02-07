import _pick from 'lodash/pick';

export const getNewProductStatus = state => state.uiStatus.newProductStatus;
export const getFetchStatus = state => state.uiStatus.fetchStatus;
export const getShoppingList = (state, listId) => {
  const result = _pick(state.shoppingLists, listId);
  return result[listId];
};
export const getShoppingLists = state => state.shoppingLists;
