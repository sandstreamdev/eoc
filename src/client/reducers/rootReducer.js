import { combineReducers } from 'redux';

import items, { uiStatus } from './itemsReducer';
import currentUser from './currentUserReducer';

const rootReducer = combineReducers({
  currentUser,
  items,
  uiStatus
});

export default rootReducer;
