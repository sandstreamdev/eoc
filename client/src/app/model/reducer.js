import { combineReducers } from 'redux';

import items, { uiStatus } from 'modules/shopping-list/model/reducer';
import currentUser from 'modules/authorization/model/reducer';

const rootReducer = combineReducers({
  currentUser,
  items,
  uiStatus
});

export default rootReducer;
