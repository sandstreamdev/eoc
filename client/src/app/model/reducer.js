import { combineReducers } from 'redux';

import items, { uiStatus } from 'modules/shopping-list/model/reducer';
import currentUser from 'modules/authorization/model/reducer';
import { shoppingLists, cohortsList } from 'modules/dashboard/model/reducer';

const rootReducer = combineReducers({
  cohortsList,
  currentUser,
  items,
  shoppingLists,
  uiStatus
});

export default rootReducer;
