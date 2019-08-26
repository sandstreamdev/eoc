const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/eoc';
const ListType = Object.freeze({
  LIMITED: 'limited',
  SHARED: 'shared'
});
const DEMO_MODE_ID = '5ce2e16d7d8999071560c9ae';
const DEMO_USER_ID = '5ce283fee76a2e02c79d8f55';
const PROJECT_NAME = 'EOC';
const DB_NAME = 'eoc';
const NUMBER_OF_ACTIVITIES_TO_SEND = 20;

const ActivityType = Object.freeze({
  COHORT_ADD_DESCRIPTION: 'activity.cohort.add-description',
  COHORT_ADD_USER: 'activity.cohort.add-user',
  COHORT_ADD: 'activity.cohort.add',
  COHORT_ARCHIVE: 'activity.cohort.archive',
  COHORT_DELETE: 'activity.cohort.delete',
  COHORT_EDIT_DESCRIPTION: 'activity.cohort.edit-description',
  COHORT_EDIT_NAME: 'activity.cohort.edit-name',
  COHORT_INVITE_USER: 'activity.cohort.invite-user',
  COHORT_REMOVE_DESCRIPTION: 'activity.cohort.remove-description',
  COHORT_REMOVE_USER: 'activity.cohort.remove-user',
  COHORT_RESTORE: 'activity.cohort.restore',
  COHORT_SET_AS_MEMBER: 'activity.cohort.set-as-member',
  COHORT_SET_AS_OWNER: 'activity.cohort.set-as-owner',
  ITEM_ADD_COMMENT: 'activity.item.add-comment',
  ITEM_ADD_DESCRIPTION: 'activity.item.add-description',
  ITEM_ADD_VOTE: 'activity.item.add-vote',
  ITEM_ADD: 'activity.item.add',
  ITEM_ARCHIVE: 'activity.item.archive',
  ITEM_CLEAR_VOTE: 'activity.item.clear-vote',
  ITEM_CLONE: 'activity.item.clone',
  ITEM_DELETE: 'activity.item.delete',
  ITEM_DONE: 'activity.item.done',
  ITEM_EDIT_DESCRIPTION: 'activity.item.edit-description',
  ITEM_EDIT_NAME: 'activity.item.edit-name',
  ITEM_REMOVE_DESCRIPTION: 'activity.item.remove-description',
  ITEM_RESTORE: 'activity.item.restore',
  ITEM_UNHANDLED: 'activity.item.unhandled',
  LIST_ADD_DESCRIPTION: 'activity.list.add-description',
  LIST_ADD_TO_FAV: 'activity.list.add-to-fav',
  LIST_ADD_USER: 'activity.list.add-user',
  LIST_ADD: 'activity.list.add',
  LIST_ARCHIVE: 'activity.list.archive',
  LIST_CHANGE_TYPE: 'activity.list.change-type',
  LIST_DELETE: 'activity.list.delete',
  LIST_EDIT_DESCRIPTION: 'activity.list.edit-description',
  LIST_EDIT_NAME: 'activity.list.edit-name',
  LIST_INVITE_USER: 'activity.list.invite-user',
  LIST_REMOVE_DESCRIPTION: 'activity.list.remove-description',
  LIST_REMOVE_FROM_FAV: 'activity.list.remove-from-fav',
  LIST_REMOVE_USER: 'activity.list.remove-user',
  LIST_RESTORE: 'activity.list.restore',
  LIST_SET_AS_MEMBER: 'activity.list.set-as-member',
  LIST_SET_AS_OWNER: 'activity.list.set-as-owner',
  LIST_SET_AS_VIEWER: 'activity.list.set-as-viewer'
});

const ItemActionTypes = Object.freeze({
  ADD_SUCCESS: 'item/ADD_SUCCESS',
  ARCHIVE_SUCCESS: 'item/ARCHIVE_SUCCESS',
  CLEAR_VOTE_SUCCESS: 'item/CLEAR_VOTE_SUCCESS',
  CLONE_SUCCESS: 'item/CLONE_SUCCESS',
  DELETE_SUCCESS: 'item/DELETE_SUCCESS',
  RESTORE_SUCCESS: 'item/RESTORE_SUCCESS',
  SET_VOTE_SUCCESS: 'item/SET_VOTE_SUCCESS',
  TOGGLE_SUCCESS: 'item/TOGGLE_SUCCESS',
  UPDATE_SUCCESS: 'item/UPDATE_SUCCESS'
});

const ItemStatusType = Object.freeze({
  LOCK: 'item/LOCK',
  UNLOCK: 'item/UNLOCK'
});

const CohortActionTypes = Object.freeze({
  ADD_MEMBER_SUCCESS: 'cohort/ADD_MEMBER_SUCCESS',
  ADD_OWNER_ROLE_SUCCESS: 'cohort/ADD_OWNER_ROLE_SUCCESS',
  ARCHIVE_SUCCESS: 'cohort/ARCHIVE_SUCCESS',
  DELETE_SUCCESS: 'cohort/DELETE_SUCCESS',
  FETCH_DETAILS_SUCCESS: 'cohort/FETCH_DETAILS_SUCCESS',
  FETCH_META_DATA_SUCCESS: 'cohort/FETCH_META_DATA_SUCCESS',
  LEAVE_SUCCESS: 'cohort/LEAVE_SUCCESS',
  REMOVE_MEMBER_SUCCESS: 'cohort/REMOVE_MEMBER_SUCCESS',
  REMOVE_WHEN_COHORT_UNAVAILABLE: 'cohort/REMOVE_WHEN_COHORT_UNAVAILABLE',
  REMOVE_ON_ARCHIVE_COHORT: 'cohort/REMOVE_ON_ARCHIVE_COHORT',
  REMOVE_OWNER_ROLE_SUCCESS: 'cohort/REMOVE_OWNER_ROLE_SUCCESS',
  RESTORE_SUCCESS: 'cohort/RESTORE_SUCCESS',
  REMOVED_BY_SOMEONE: 'cohort/REMOVED_BY_SOMEONE',
  UPDATE_SUCCESS: 'cohort/UPDATE_SUCCESS'
});

const CohortHeaderStatusTypes = Object.freeze({
  LOCK: 'cohort-header/LOCK',
  UNLOCK: 'cohort-header/UNLOCK'
});

const CommentActionTypes = Object.freeze({
  ADD_SUCCESS: 'comment/ADD_SUCCESS'
});

const ListActionTypes = Object.freeze({
  ADD_MEMBER_ROLE_SUCCESS: 'list/ADD_MEMBER_ROLE_SUCCESS',
  ADD_OWNER_ROLE_SUCCESS: 'list/ADD_OWNER_ROLE_SUCCESS',
  ADD_VIEWER_SUCCESS: 'list/ADD_VIEWER_SUCCESS',
  ARCHIVE_SUCCESS: 'list/ARCHIVE_SUCCESS',
  CHANGE_TYPE_SUCCESS: 'list/CHANGE_TYPE_SUCCESS',
  CREATE_SUCCESS: 'list/CREATE_SUCCESS',
  DELETE_AND_REDIRECT: 'list/DELETE_AND_REDIRECT',
  DELETE_SUCCESS: 'list/DELETE_SUCCESS',
  FETCH_ARCHIVED_META_DATA_SUCCESS: 'list/FETCH_ARCHIVED_META_DATA_SUCCESS',
  FETCH_META_DATA_SUCCESS: 'list/FETCH_META_DATA_SUCCESS',
  LEAVE_ON_TYPE_CHANGE_SUCCESS: 'list/LEAVE_ON_TYPE_CHANGE_SUCCESS',
  LEAVE_SUCCESS: 'list/LEAVE_SUCCESS',
  MEMBER_UPDATE_SUCCESS: 'list/MEMBER_UPDATE_SUCCESS',
  REMOVE_BY_IDS: 'list/REMOVE_BY_IDS',
  REMOVE_MEMBER_ROLE_SUCCESS: 'list/REMOVE_MEMBER_ROLE_SUCCESS',
  REMOVE_MEMBER_SUCCESS: 'list/REMOVE_MEMBER_SUCCESS',
  REMOVE_WHEN_COHORT_UNAVAILABLE: 'list/REMOVE_WHEN_COHORT_UNAVAILABLE',
  REMOVE_OWNER_ROLE_SUCCESS: 'list/REMOVE_OWNER_ROLE_SUCCESS',
  REMOVED_BY_SOMEONE: 'list/REMOVED_BY_SOMEONE',
  RESTORE_SUCCESS: 'list/RESTORE_SUCCESS',
  UPDATE_SUCCESS: 'list/UPDATE_SUCCESS'
});

const ListHeaderStatusTypes = Object.freeze({
  LOCK: 'list-header/LOCK',
  UNLOCK: 'list-header/UNLOCK'
});

const LOCK_TIMEOUT = 300000;
const SOCKET_TIMEOUT = 60000;

const ViewType = {
  LIST: 'viewType/LIST',
  TILES: 'viewType/TILES'
};

module.exports = {
  ActivityType,
  CohortActionTypes,
  CohortHeaderStatusTypes,
  CommentActionTypes,
  DB_NAME,
  DB_URL,
  DEMO_MODE_ID,
  DEMO_USER_ID,
  ItemActionTypes,
  ItemStatusType,
  ListActionTypes,
  ListHeaderStatusTypes,
  ListType,
  LOCK_TIMEOUT,
  NUMBER_OF_ACTIVITIES_TO_SEND,
  PROJECT_NAME,
  SOCKET_TIMEOUT,
  ViewType
};
