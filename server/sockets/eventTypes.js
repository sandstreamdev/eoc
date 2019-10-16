const { enumerable } = require('../common/utils');

const ItemActionTypes = enumerable('item')(
  'ADD_SUCCESS',
  'ARCHIVE_SUCCESS',
  'CLEAR_VOTE_SUCCESS',
  'CLONE_SUCCESS',
  'DELETE_SUCCESS',
  'MARK_AS_DONE_SUCCESS',
  'MARK_AS_UNHANDLED_SUCCESS',
  'RESTORE_SUCCESS',
  'SET_VOTE_SUCCESS',
  'UPDATE_SUCCESS'
);

const ItemStatusType = enumerable('item')('LOCK', 'UNLOCK');

const CohortActionTypes = enumerable('cohort')(
  'ADD_MEMBER_SUCCESS',
  'ADD_OWNER_ROLE_SUCCESS',
  'ARCHIVE_SUCCESS',
  'DELETE_SUCCESS',
  'FETCH_DETAILS_SUCCESS',
  'FETCH_META_DATA_SUCCESS',
  'LEAVE_SUCCESS',
  'REMOVE_MEMBER_SUCCESS',
  'REMOVE_OWNER_ROLE_SUCCESS',
  'RESTORE_SUCCESS',
  'UPDATE_SUCCESS'
);

const CohortHeaderStatusTypes = enumerable('cohort-header')('LOCK', 'UNLOCK');

const CommentActionTypes = enumerable('comment')('ADD_SUCCESS');

const ListActionTypes = enumerable('list')(
  'ADD_MEMBER_ROLE_SUCCESS',
  'ADD_OWNER_ROLE_SUCCESS',
  'ADD_VIEWER_SUCCESS',
  'ARCHIVE_SUCCESS',
  'ARCHIVE_COHORT_SUCCESS',
  'CHANGE_TYPE_SUCCESS',
  'CREATE_SUCCESS',
  'DELETE_SUCCESS',
  'FETCH_ARCHIVED_META_DATA_SUCCESS',
  'FETCH_META_DATA_SUCCESS',
  'LEAVE_SUCCESS',
  'MEMBER_UPDATE_SUCCESS',
  'REMOVE_BY_IDS',
  'REMOVE_MEMBER_ROLE_SUCCESS',
  'REMOVE_MEMBER_SUCCESS',
  'REMOVE_OWNER_ROLE_SUCCESS',
  'RESTORE_SUCCESS',
  'UPDATE_SUCCESS'
);

const ListHeaderStatusTypes = enumerable('list-header')('LOCK', 'UNLOCK');

const AppEvents = enumerable()('JOIN_ROOM', 'LEAVE_ROOM');

const UserEvents = enumerable('user')('LOGOUT_SUCCESS');

module.exports = {
  AppEvents,
  CohortActionTypes,
  CohortHeaderStatusTypes,
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType,
  ListActionTypes,
  ListHeaderStatusTypes,
  UserEvents
};
