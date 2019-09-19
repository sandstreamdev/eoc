import _pick from 'lodash/pick';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';
import { createSelector } from 'reselect';
import _sortBy from 'lodash/sortBy';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';

export const getList = (state, listId) => _pick(state.lists, listId)[listId];

export const getItems = createSelector(
  [getList],
  list => {
    if (list) {
      const { items = {} } = list;

      return _orderBy(
        _map(items, item => ({
          ...item,
          comments: _keyBy(
            _orderBy(
              item.comments,
              comment => new Date(comment.createdAt).getTime(),
              ['desc']
            ),
            '_id'
          )
        })),
        el => new Date(el.createdAt).getTime(),
        ['desc']
      );
    }
  }
);

const getActiveItems = createSelector(
  [getItems],
  items => _filter(items, item => !item.isArchived)
);

export const getArchivedItems = createSelector(
  [getItems],
  items => _filter(items, item => item.isArchived)
);

export const getDoneItems = createSelector(
  [getActiveItems],
  items => _filter(items, item => item.done)
);

export const getUndoneItems = createSelector(
  [getActiveItems],
  items => _filter(items, item => !item.done)
);

export const getLists = state => state.lists;

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

export const getCohortsLists = createSelector(
  getActiveLists,
  lists => _keyBy(_filter(lists, list => list.cohortId), '_id')
);

const getCohortLists = (state, id) =>
  _filter(state.lists, list => list.cohortId === id);

export const getCohortActiveLists = createSelector(
  getCohortLists,
  lists =>
    _keyBy(
      _sortBy(_filter(lists, list => !list.isArchived), el => !el.isFavourite),
      '_id'
    )
);

export const getCohortArchivedLists = createSelector(
  getCohortLists,
  lists =>
    _keyBy(
      _sortBy(_filter(lists, list => list.isArchived), el => !el.isFavourite),
      '_id'
    )
);

export const getMembers = createSelector(
  getList,
  list => list && list.members
);

export const getListsNames = createSelector(
  [getList, getLists],
  (currentList, lists) =>
    _sortBy(_filter(lists, list => list._id !== currentList._id), el => el.name)
);
