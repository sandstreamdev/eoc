import { combineReducers } from 'redux';

import items, { uiStatus } from './itemsReducer';
import user from './currentUserReducer';

const rootReducer = combineReducers({
  items,
  uiStatus,
  currentUser: user
});

export default rootReducer;
