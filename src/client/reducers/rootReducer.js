import { combineReducers } from 'redux';

import items, { uiStatus } from './itemsReducer';
import currentUser from './currentUserReducer';

const rootReducer = combineReducers({
  items,
  uiStatus,
  currentUser
});

export default rootReducer;
