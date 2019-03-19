import _pick from 'lodash/pick';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';
import { createSelector } from 'reselect';

export const getList = (state, listId) =>
  _pick(state.lists.data, listId)[listId];
export const getItems = (state, listId) => {
  const currentList = getList(state, listId);

  if (currentList) {
    const { items } = currentList;
    return (
      items &&
      items.sort((a, b) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
          ? -1
          : 1
      )
    );
  }
};
export const getLists = state => state.lists.data;

export const getActiveLists = createSelector(
  getLists,
  lists => _keyBy(_filter(lists, list => !list.isArchived), '_id')
);

export const getArchivedLists = createSelector(
  getLists,
  lists => _keyBy(_filter(lists, list => list.isArchived), '_id')
);

export const getIsFetchingLists = state => state.lists.isFetching;
