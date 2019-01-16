import { combineReducers } from 'redux';

import items, { uiStatus } from 'modules/legacy/reducers/itemsReducer';
import currentUser from 'modules/legacy/reducers/currentUserReducer';

const rootReducer = combineReducers({
  currentUser,
  items,
  uiStatus
});

export default rootReducer;
