const { enumerable } = require('../common/utils');

const ItemEvents = enumerable('item')(
  'ADD_SUCCESS',
  'ARCHIVE_SUCCESS',
  'CLEAR_VOTE_SUCCESS',
  'CLONE_SUCCESS',
  'DELETE_SUCCESS',
  'RESTORE_SUCCESS',
  'SET_VOTE_SUCCESS',
  'UPDATE_SUCCESS'
);

const ItemStatusEvents = enumerable('item')('LOCK', 'UNLOCK');

const CohortEvents = enumerable('cohort')(
  'ADD_MEMBER_SUCCESS',
  'ADD_OWNER_ROLE_SUCCESS',
  'ARCHIVE_SUCCESS',
  'DELETE_SUCCESS',
  'FETCH_DETAILS_SUCCESS',
  'FETCH_META_DATA_SUCCESS',
  'LEAVE_SUCCESS',
  'REMOVE_MEMBER_SUCCESS',
  'REMOVE_WHEN_COHORT_UNAVAILABLE:',
  'REMOVE_ON_ARCHIVE_COHORT',
  'REMOVE_OWNER_ROLE_SUCCESS',
  'RESTORE_SUCCESS',
  'UPDATE_SUCCESS'
);

const CohortHeaderStatusEvents = enumerable('cohort-header')('LOCK', 'UNLOCK');

const CommentEvents = enumerable('comment')('ADD_SUCCESS');

const ListEvents = enumerable('list')(
  'ADD_MEMBER_ROLE_SUCCESS',
  'ADD_OWNER_ROLE_SUCCESS',
  'ADD_VIEWER_SUCCESS',
  'ARCHIVE_SUCCESS',
  'CHANGE_TYPE_SUCCESS',
  'CREATE_SUCCESS',
  'DELETE_AND_REDIRECT',
  'DELETE_SUCCESS',
  'FETCH_ARCHIVED_META_DATA_SUCCESS',
  'FETCH_META_DATA_SUCCESS',
  'LEAVE_ON_TYPE_CHANGE_SUCCESS',
  'LEAVE_SUCCESS',
  'MEMBER_UPDATE_SUCCESS',
  'REMOVE_BY_IDS',
  'REMOVE_MEMBER_ROLE_SUCCESS',
  'REMOVE_MEMBER_SUCCESS',
  'REMOVE_WHEN_COHORT_UNAVAILABLE',
  'REMOVE_OWNER_ROLE_SUCCESS',
  'REMOVED_BY_SOMEONE',
  'RESTORE_SUCCESS',
  'UPDATE_SUCCESS'
);

const ListHeaderStatusEvents = enumerable('list-header')('LOCK', 'UNLOCK');

const AppEvents = enumerable()('JOIN_ROOM', 'LEAVE_ROOM');

module.exports = {
  AppEvents,
  CohortEvents,
  CohortHeaderStatusEvents,
  CommentEvents,
  ItemEvents,
  ItemStatusEvents,
  ListEvents,
  ListHeaderStatusEvents
};
