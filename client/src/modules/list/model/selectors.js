import { filter, sortBy } from '@sandstreamdev/std/object';
import { not } from '@sandstreamdev/std/function';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';
import { createSelector } from 'reselect';
import _orderBy from 'lodash/orderBy';

export const getList = (state, listId) => state.lists[listId];

export const getItems = createSelector(
  getList,
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

const isArchived = ({ archived }) => archived;
const isNotArchived = not(isArchived);

const isDone = ({ done }) => done;
const isNotDone = not(done);

const getActiveItems = createSelector(
  getItems,
  filter(isNotArchived)
);

export const getArchivedItems = createSelector(
  getItems,
  filter(isArchived)
);

export const getDoneItems = createSelector(
  getActiveItems,
  filter(isDone)
);

export const getUndoneItems = createSelector(
  getActiveItems,
  filter(isNotDone)
);

export const getLists = state =>
  _orderBy(state.lists, el => new Date(el.createdAt).getTime(), ['desc']);

const isFavourite = ({ isFavourite }) => isFavourite;
const isNotFavourite = not(isFavourite);

const getOrderedLists = createSelector(
  getLists,
  sortBy(isNotFavourite)
);

export const getActiveLists = createSelector(
  getOrderedLists,
  filter(isNotArchived)
);

export const getArchivedLists = createSelector(
  getOrderedLists,
  filter(isArchived)
);

const isPrivate = ({ cohortId }) => !cohortId;
const isNotPrivate = not(isPrivate);

export const getPrivateLists = createSelector(
  getActiveLists,
  lists => filter(lists, isPrivate)
);

export const getCohortsLists = createSelector(
  getActiveLists,
  lists => filter(lists, isNotPrivate)
);

const getCohortLists = (state, id) => state.lists[id];

const getOrderedCohortLists = createSelector(
  getCohortLists,
  sortBy(isNotFavourite)
);

export const getCohortActiveLists = createSelector(
  getOrderedCohortLists,
  filter(isNotArchived)
);

export const getCohortArchivedLists = createSelector(
  getOrderedCohortLists,
  filter(isArchived)
);

export const getMembers = createSelector(
  getList,
  list => list && list.members
);

const name = ({ name }) => name;

export const getListsNames = createSelector(
  getList,
  getLists,
  (currentList, lists) =>
    _sortBy(_filter(lists, list => list._id !== currentList._id), name)
);

export const getLimits = createSelector(
  getList,
  list => list && list.limits
);
