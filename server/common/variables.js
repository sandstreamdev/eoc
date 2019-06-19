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
  ITEM_DELETE: 'activity.item.delete'
});

const ItemActionTypes = Object.freeze({
  ADD_SUCCESS: 'item/ADD_SUCCESS',
  ARCHIVE_SUCCESS: 'item/ARCHIVE_SUCCESS'
});

module.exports = {
  ActivityType,
  DB_URL,
  DEMO_MODE_ID,
  DEMO_USER_ID,
  ItemActionTypes,
  ListType,
  PROJECT_NAME
};
