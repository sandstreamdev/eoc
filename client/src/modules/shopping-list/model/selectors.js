import _pick from 'lodash/pick';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

export const getList = (state, listId) =>
  _pick(state.lists.data, listId)[listId];
export const getItemsForCurrentList = (state, listId) => {
  const currentList = _pick(state.lists.data, listId)[listId];
  if (
    currentList &&
    Object.prototype.hasOwnProperty.call(currentList, 'products')
  ) {
    const { products } = currentList;
    return products.sort((a, b) =>
      new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1
    );
  }
};
export const getLists = state => state.lists.data;
export const getCohortLists = (state, cohortId) =>
  _keyBy(
    _filter(state.lists.data, value => value.cohortId === cohortId),
    '_id'
  );

export const getIsFetchingLists = state => state.lists.isFetching;
