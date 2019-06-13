const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/eoc';
const ListType = Object.freeze({
  LIMITED: 'limited',
  SHARED: 'shared'
});
const DEMO_MODE_ID = '5ce2e16d7d8999071560c9ae';
const DEMO_USER_ID = '5ce283fee76a2e02c79d8f55';
const PROJECT_NAME = 'EOC';
const ActivityType = Object.freeze({
  ITEM_ADD: 'activity.item.add',
  ITEM_DELETE: 'activity.item.delete',
  ITEM_CLONE: 'activity.item.clone',
  ITEM_ADD_VOTE: 'activity.item.add-vote',
  ITEM_CLEAR_VOTE: 'activity.item.clear-vote',
  ITEM_ADD_DESCRIPTION: 'activity.item.add_description',
  ITEM_REMOVE_DESCRIPTION: 'activity.item.remove_description',
  ITEM_EDIT_DESCRIPTION: 'activity.item.edit_description',
  ITEM_EDIT_NAME: 'activity.item.edit_name',
  ITEM_ARCHIVE: 'activity.item.archive',
  ITEM_RESTORE: 'activity.item.restore',
  ITEM_DONE: 'activity.item.done',
  ITEM_UNHANDLED: 'activity.item.unhandled',
  ITEM_ADD_COMMENT: 'activity.item.add-comment'
});

module.exports = {
  ActivityType,
  DB_URL,
  DEMO_MODE_ID,
  DEMO_USER_ID,
  ListType,
  PROJECT_NAME
};
