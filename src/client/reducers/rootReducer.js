import { combineReducers } from 'redux';

import items, { uiStatus } from './itemsReducer';

const rootReducer = combineReducers({
  items,
  uiStatus
});

export default rootReducer;
