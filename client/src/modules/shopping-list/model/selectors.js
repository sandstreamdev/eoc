import _pick from 'lodash/pick';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

export const getList = (state, listId) =>
  _pick(state.lists.data, listId)[listId];
export const getLists = state => state.lists.data;
export const getCohortLists = (state, cohortId) =>
  _keyBy(
    _filter(state.lists.data, value => value.cohortId === cohortId),
    '_id'
  );

export const getIsFetchingLists = state => state.lists.isFetching;
