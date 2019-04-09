import _pick from 'lodash/pick';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';
import { createSelector } from 'reselect';
import _sortBy from 'lodash/sortBy';

export const getList = (state, listId) =>
  _pick(state.lists.data, listId)[listId];

export const getItems = createSelector(
  [getList],
  list => {
    if (list) {
      const { items = [] } = list;

      return items.sort((a, b) =>
        new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()
          ? 1
          : -1
      );
    }
  }
);

export const getLists = state => state.lists.data;

export const getActiveLists = createSelector(
  getLists,
  lists =>
    _keyBy(
      _sortBy(_filter(lists, list => !list.isArchived), el => !el.isFavourite),
      '_id'
    )
);

export const getArchivedLists = createSelector(
  getLists,
  lists =>
    _keyBy(
      _sortBy(_filter(lists, list => list.isArchived), el => !el.isFavourite),
      '_id'
    )
);

export const getPrivateLists = createSelector(
  getActiveLists,
  lists => _keyBy(_filter(lists, list => !list.cohortId), '_id')
);

export const getCohortLists = createSelector(
  getActiveLists,
  lists => _keyBy(_filter(lists, list => list.cohortId), '_id')
);

export const getIsFetchingLists = state => state.lists.isFetching;

export const getMembers = createSelector(
  getList,
  list => list && _keyBy(list.members, '_id')
);
