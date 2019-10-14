const { enumerable } = require('./utils');

const DB_NAME = 'eoc';
const DB_SERVER_URL = process.env.DB_SERVER_URL || 'mongodb://localhost:27017';
const DB_URL = process.env.DB_URL || `${DB_SERVER_URL}/${DB_NAME}`;
const ListType = Object.freeze({
  LIMITED: 'limited',
  SHARED: 'shared'
});
const DEMO_MODE_ID = '5ce2e16d7d8999071560c9ae';
const DEMO_USER_ID = '5ce283fee76a2e02c79d8f55';
const PROJECT_NAME = 'EOC';
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
  ITEM_MOVE: 'activity.item.move-to-list',
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

const LOCK_TIMEOUT = 300000;
const SOCKET_TIMEOUT = 60000;
const EXPIRATION_TIME = 3600000;

const Routes = Object.freeze({
  COHORT: 'cohort',
  COHORTS: 'cohorts',
  DASHBOARD: 'dashboard',
  LIST: 'sack'
});

const ViewType = enumerable('viewType')('LIST', 'TILES');

const BadRequestReason = enumerable('reason')('VALIDATION');

const NotificationFrequency = enumerable('notification')(
  'FRIDAY, MONDAY, NEVER, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY, WEEKLY'
);

module.exports = {
  ActivityType,
  BadRequestReason,
  DB_NAME,
  DB_SERVER_URL,
  DB_URL,
  DEMO_MODE_ID,
  DEMO_USER_ID,
  EXPIRATION_TIME,
  ListType,
  LOCK_TIMEOUT,
  NotificationFrequency,
  NUMBER_OF_ACTIVITIES_TO_SEND,
  PROJECT_NAME,
  Routes,
  SOCKET_TIMEOUT,
  ViewType
};
